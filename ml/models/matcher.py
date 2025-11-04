import os
import time
import hashlib
import numpy as np
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional, Tuple
import requests

from utils.text_processor import (
    normalize_text, 
    clean_address, 
    extract_pincode,
    highlight_matching_tokens
)


class AddressMatcher:
    def __init__(self, csv_path: str, model_name: str = "sentence-transformers/all-MiniLM-L6-v2", cache_dir: str = "./cache"):
        self.csv_path = csv_path
        self.model_name = model_name
        self.cache_dir = cache_dir
        self.model = None
        self.index = None
        self.df = None
        self.metadata = None
        self.total_records = 0
        self.is_ready = False
        
        # DIGIPIN API configuration
        self.digipin_api = os.getenv("DIGIPIN_API_URL", "http://localhost:5002")
        
        # Cache file paths
        os.makedirs(self.cache_dir, exist_ok=True)
        self.embeddings_path = os.path.join(self.cache_dir, "embeddings.npy")
        self.index_path = os.path.join(self.cache_dir, "faiss.index")
        self.metadata_path = os.path.join(self.cache_dir, "metadata.pkl")
        
    async def initialize(self):
        """Initialize matcher: load model and build/load index"""
        print("📊 Loading dataset...")
        await self._load_dataset()
        
        print("🤖 Loading sentence transformer model...")
        await self._load_model()
        
        # Check if cached index exists
        if self._cache_exists():
            print("📦 Loading cached FAISS index and metadata...")
            await self._load_from_cache()
        else:
            print("🔍 Building FAISS index from scratch...")
            await self._build_index()
            print("💾 Saving index to cache...")
            await self._save_to_cache()
        
        self.is_ready = True
        print(f"✅ Matcher initialized with {self.total_records} records")
        
    async def _load_dataset(self):
        """Load and preprocess the PIN code dataset"""
        try:
            # Load CSV
            df = pd.read_csv(self.csv_path)
            
            # Normalize column names
            df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
            
            # Detect columns
            col_map = self._detect_columns(df)
            
            # Select and rename relevant columns
            required_cols = ['officename', 'pincode', 'district', 'state']
            optional_cols = ['latitude', 'longitude', 'officetype', 'delivery']
            
            # Filter valid records
            df = df.dropna(subset=[col_map['officename'], col_map['pincode']])
            
            # Create standardized dataframe
            data_dict = {
                'officename': df[col_map['officename']],
                'pincode': df[col_map['pincode']].astype(str),
                'district': df[col_map.get('district', col_map['officename'])],
                'state': df[col_map.get('state', col_map['officename'])]
            }
            
            # Add optional columns if available
            if col_map.get('latitude'):
                data_dict['latitude'] = pd.to_numeric(df[col_map['latitude']], errors='coerce')
            if col_map.get('longitude'):
                data_dict['longitude'] = pd.to_numeric(df[col_map['longitude']], errors='coerce')
            if col_map.get('officetype'):
                data_dict['officetype'] = df[col_map['officetype']]
            if col_map.get('delivery'):
                data_dict['delivery'] = df[col_map['delivery']]
                
            self.df = pd.DataFrame(data_dict)
            
            # Filter delivery offices only
            if 'delivery' in self.df.columns:
                self.df = self.df[self.df['delivery'].str.lower().str.contains('delivery', na=False)]
            
            # Create searchable text combining all fields
            self.df['search_text'] = (
                self.df['officename'].astype(str) + ' ' +
                self.df['district'].astype(str) + ' ' +
                self.df['state'].astype(str) + ' ' +
                self.df['pincode'].astype(str)
            )
            
            # Normalize search text
            self.df['search_text_norm'] = self.df['search_text'].apply(normalize_text)
            
            # Generate DIGIPIN (will be done lazily when needed, not during init)
            # Set to N/A initially to avoid startup delays
            self.df['digipin'] = 'N/A'
            
            self.total_records = len(self.df)
            print(f"✅ Loaded {self.total_records} post office records")
            
        except Exception as e:
            raise Exception(f"Failed to load dataset: {str(e)}")
    
    def _detect_columns(self, df: pd.DataFrame) -> Dict[str, str]:
        """Auto-detect column names from dataset"""
        cols = [c.strip().lower() for c in df.columns]
        mapping = {}
        
        def find(keywords):
            for keyword in keywords:
                for col in cols:
                    if keyword in col:
                        return col
            return None
        
        mapping['officename'] = find(['officename', 'office_name', 'po_name', 'name'])
        mapping['pincode'] = find(['pincode', 'postalcode', 'pin', 'postal_code'])
        mapping['district'] = find(['district'])
        mapping['state'] = find(['state', 'statename'])
        mapping['latitude'] = find(['lat', 'latitude'])
        mapping['longitude'] = find(['lon', 'lng', 'longitude'])
        mapping['officetype'] = find(['officetype', 'office_type', 'type'])
        mapping['delivery'] = find(['delivery'])
        
        return mapping
    
    def _generate_digipin(self, row) -> str:
        """Generate DIGIPIN using the real DIGIPIN API"""
        try:
            # Use lat/long if available to call real DIGIPIN API
            if pd.notna(row.get('latitude')) and pd.notna(row.get('longitude')):
                try:
                    # Call real DIGIPIN encode API
                    response = requests.post(
                        f"{self.digipin_api}/api/digipin/encode",
                        json={
                            "latitude": float(row['latitude']),
                            "longitude": float(row['longitude'])
                        },
                        timeout=5
                    )
                    if response.status_code == 200:
                        return response.json().get('digipin', 'N/A')
                except Exception as e:
                    print(f"⚠️  DIGIPIN API call failed: {e}")
            
            # Fallback: If DIGIPIN API is unavailable or no lat/long, return N/A
            return "N/A"
        except:
            return "N/A"
    
    def _generate_digipin_for_coords(self, latitude: float, longitude: float) -> str:
        """Generate DIGIPIN for specific coordinates using real DIGIPIN API"""
        try:
            response = requests.post(
                f"{self.digipin_api}/api/digipin/encode",
                json={
                    "latitude": latitude,
                    "longitude": longitude
                },
                timeout=2  # Short timeout to avoid hanging
            )
            if response.status_code == 200:
                return response.json().get('digipin', 'N/A')
        except Exception as e:
            print(f"⚠️  DIGIPIN API call failed: {e}")
        return "N/A"
    
    async def _load_model(self):
        """Load sentence transformer model"""
        try:
            self.model = SentenceTransformer(self.model_name)
            print(f"✅ Model loaded: {self.model_name}")
        except Exception as e:
            raise Exception(f"Failed to load model: {str(e)}")
    
    async def _build_index(self):
        """Build FAISS index from embeddings"""
        try:
            # Generate embeddings for all records
            print(f"Encoding {len(self.df)} records...")
            texts = self.df['search_text_norm'].tolist()
            
            embeddings = self.model.encode(
                texts,
                batch_size=128,
                show_progress_bar=True,
                convert_to_numpy=True
            )
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings)
            
            # Create FAISS index
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatIP(dimension)  # Inner product = cosine similarity
            self.index.add(embeddings.astype('float32'))
            
            # Store metadata separately
            self.metadata = self.df[[
                'officename', 'district', 'state', 'pincode', 
                'digipin', 'search_text'
            ]].copy()
            
            # Add lat/long if available
            if 'latitude' in self.df.columns:
                self.metadata['latitude'] = self.df['latitude']
            if 'longitude' in self.df.columns:
                self.metadata['longitude'] = self.df['longitude']
            if 'officetype' in self.df.columns:
                self.metadata['officetype'] = self.df['officetype']
            
            print(f"✅ FAISS index built with dimension {dimension}")
            
        except Exception as e:
            raise Exception(f"Failed to build index: {str(e)}")
    
    def _cache_exists(self) -> bool:
        """Check if cache files exist"""
        return (
            os.path.exists(self.embeddings_path) and
            os.path.exists(self.index_path) and
            os.path.exists(self.metadata_path)
        )
    
    async def _save_to_cache(self):
        """Save embeddings, index, and metadata to disk"""
        try:
            # Save FAISS index
            faiss.write_index(self.index, self.index_path)
            
            # Save metadata
            self.metadata.to_pickle(self.metadata_path)
            
            print(f"✅ Cache saved to {self.cache_dir}")
            
        except Exception as e:
            print(f"⚠️  Warning: Failed to save cache: {str(e)}")
    
    async def _load_from_cache(self):
        """Load embeddings, index, and metadata from disk"""
        try:
            # Load FAISS index
            self.index = faiss.read_index(self.index_path)
            
            # Load metadata
            self.metadata = pd.read_pickle(self.metadata_path)
            
            print(f"✅ Cache loaded from {self.cache_dir}")
            
        except Exception as e:
            raise Exception(f"Failed to load cache: {str(e)}")
    
    def clear_cache(self):
        """Clear cached files"""
        try:
            if os.path.exists(self.embeddings_path):
                os.remove(self.embeddings_path)
            if os.path.exists(self.index_path):
                os.remove(self.index_path)
            if os.path.exists(self.metadata_path):
                os.remove(self.metadata_path)
            print(f"✅ Cache cleared from {self.cache_dir}")
        except Exception as e:
            print(f"⚠️  Warning: Failed to clear cache: {str(e)}")
    
    async def match(
        self, 
        query_text: str, 
        top_k: int = 5,
        include_digipin: bool = True
    ) -> Dict:
        """
        Match query address to post offices
        
        Args:
            query_text: Address text to match
            top_k: Number of top matches to return
            include_digipin: Whether to include DIGIPIN codes
            
        Returns:
            Dictionary with matches and metadata
        """
        start_time = time.time()
        
        # Clean and normalize query
        normalized_query = normalize_text(query_text)
        cleaned_query = clean_address(query_text)
        
        # Extract PIN code from query if present
        query_pincode = extract_pincode(query_text)
        
        # Generate query embedding
        query_embedding = self.model.encode(
            [cleaned_query],
            convert_to_numpy=True
        )
        faiss.normalize_L2(query_embedding)
        
        # Search FAISS index
        similarities, indices = self.index.search(
            query_embedding.astype('float32'), 
            top_k * 3  # Get more candidates for re-ranking
        )
        
        # Build candidate list
        candidates = []
        for sim, idx in zip(similarities[0], indices[0]):
            if idx == -1:
                continue
                
            record = self.metadata.iloc[idx]
            
            # Calculate confidence score
            confidence = self._calculate_confidence(
                similarity=float(sim),
                record=record,
                query=cleaned_query,
                query_pincode=query_pincode
            )
            
            # Build match result
            match = {
                'officename': str(record['officename']),
                'district': str(record['district']),
                'state': str(record['state']),
                'pincode': str(record['pincode']),
                'similarity': round(float(sim), 4),
                'confidence': round(confidence, 4)
            }
            
            # Add optional fields
            if include_digipin:
                # Generate DIGIPIN on-demand only when requested
                if 'latitude' in record and pd.notna(record['latitude']) and 'longitude' in record and pd.notna(record['longitude']):
                    digipin = self._generate_digipin_for_coords(float(record['latitude']), float(record['longitude']))
                    match['digipin'] = digipin
                else:
                    match['digipin'] = 'N/A'
            
            if 'latitude' in record and pd.notna(record['latitude']):
                match['latitude'] = float(record['latitude'])
            if 'longitude' in record and pd.notna(record['longitude']):
                match['longitude'] = float(record['longitude'])
            if 'officetype' in record:
                match['officetype'] = str(record['officetype'])
            
            # Add matched tokens for explainability
            match['matched_tokens'] = highlight_matching_tokens(
                cleaned_query, 
                record['search_text']
            )
            
            candidates.append(match)
        
        # Sort by confidence
        candidates.sort(key=lambda x: x['confidence'], reverse=True)
        
        # Take top K
        final_matches = candidates[:top_k]
        
        # Add rank
        for i, match in enumerate(final_matches, 1):
            match['rank'] = i
        
        processing_time = (time.time() - start_time) * 1000  # Convert to ms
        
        return {
            'query': query_text,
            'normalized_query': normalized_query,
            'matches': final_matches,
            'processing_time_ms': round(processing_time, 2)
        }
    
    def _calculate_confidence(
        self,
        similarity: float,
        record: pd.Series,
        query: str,
        query_pincode: str
    ) -> float:
        """
        Calculate confidence score considering multiple factors
        
        Args:
            similarity: Embedding similarity score
            record: Post office record
            query: Normalized query text
            query_pincode: Extracted PIN code from query
            
        Returns:
            Confidence score between 0 and 1
        """
        confidence = similarity  # Base confidence from embedding
        
        # Boost if PIN code matches
        if query_pincode and query_pincode == str(record['pincode']):
            confidence = min(1.0, confidence + 0.2)
        
        # Boost if office name appears in query
        office_name = normalize_text(str(record['officename']))
        if office_name in query:
            confidence = min(1.0, confidence + 0.15)
        
        # Boost if district appears in query
        district_name = normalize_text(str(record['district']))
        if district_name in query:
            confidence = min(1.0, confidence + 0.1)
        
        # Boost if state appears in query
        state_name = normalize_text(str(record['state']))
        if state_name in query:
            confidence = min(1.0, confidence + 0.05)
        
        return min(1.0, confidence)
