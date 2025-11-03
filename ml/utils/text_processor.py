import re
from typing import Dict, List

# Common abbreviations in Indian addresses
ABBREVIATIONS = {
    'po': 'post office',
    'bo': 'branch office',
    'so': 'sub office',
    'ho': 'head office',
    'dist': 'district',
    'nr': 'near',
    'rd': 'road',
    'st': 'street',
    'ave': 'avenue',
    'blvd': 'boulevard',
    'apt': 'apartment',
    'bldg': 'building',
    'flr': 'floor',
    'dept': 'department',
    'no': 'number',
    'nagar': 'nagar',
    'gali': 'gali',
    'marg': 'marg',
    'colony': 'colony',
    'sector': 'sector',
    'phase': 'phase',
    'block': 'block',
    'h/o': 'house of',
    's/o': 'son of',
    'd/o': 'daughter of',
    'w/o': 'wife of',
    'c/o': 'care of',
    'tel': 'telangana',
    'tg': 'telangana',
    'ap': 'andhra pradesh',
    'up': 'uttar pradesh',
    'hp': 'himachal pradesh',
    'mp': 'madhya pradesh',
    'tn': 'tamil nadu',
    'wb': 'west bengal',
    'ka': 'karnataka',
    'mh': 'maharashtra',
    'dl': 'delhi',
    'rj': 'rajasthan',
    'pb': 'punjab',
    'hr': 'haryana',
    'jk': 'jammu kashmir',
    'gj': 'gujarat',
    'or': 'odisha',
    'br': 'bihar',
    'jh': 'jharkhand',
    'as': 'assam',
    'uk': 'uttarakhand',
}


def normalize_text(text: str) -> str:
    if not text:
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters but keep spaces and alphanumeric
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Strip leading/trailing whitespace
    text = text.strip()
    
    return text


def expand_abbreviations(text: str) -> str:
    words = text.split()
    expanded_words = []
    
    for word in words:
        # Check if word is an abbreviation
        if word.lower() in ABBREVIATIONS:
            expanded_words.append(ABBREVIATIONS[word.lower()])
        else:
            expanded_words.append(word)
    
    return ' '.join(expanded_words)


def extract_pincode(text: str) -> str:
    # Look for 6-digit numbers
    match = re.search(r'\b\d{6}\b', text)
    if match:
        return match.group(0)
    return ""


def remove_personal_info(text: str) -> str:
    # Remove mobile numbers (10 digits)
    text = re.sub(r'\b\d{10}\b', '', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove patterns like "S/O", "D/O", "W/O" followed by names
    text = re.sub(r'\b[sdw]/o\s+\w+\s+\w+', '', text, flags=re.IGNORECASE)
    
    # Remove "Mr.", "Mrs.", "Ms.", "Dr." titles
    text = re.sub(r'\b(mr|mrs|ms|dr|shri|smt)\.?\s+', '', text, flags=re.IGNORECASE)
    
    return text


def clean_address(text: str) -> str:
    if not text:
        return ""
    
    # Step 1: Remove personal info
    text = remove_personal_info(text)
    
    # Step 2: Normalize
    text = normalize_text(text)
    
    # Step 3: Expand abbreviations
    text = expand_abbreviations(text)
    
    # Step 4: Final normalization
    text = normalize_text(text)
    
    return text


def extract_address_components(text: str) -> Dict[str, str]:
    components = {
        'pincode': '',
        'city': '',
        'state': '',
        'district': '',
        'raw_text': text
    }
    
    # Extract PIN code
    components['pincode'] = extract_pincode(text)
    
    # Extract state (if matches known abbreviations)
    text_lower = text.lower()
    for abbr, full_name in ABBREVIATIONS.items():
        if len(abbr) == 2 and abbr in text_lower.split():
            components['state'] = full_name
            break
    
    return components


def calculate_text_similarity(text1: str, text2: str) -> float:
    # Normalize both texts
    text1 = normalize_text(text1)
    text2 = normalize_text(text2)
    
    # Get word sets
    set1 = set(text1.split())
    set2 = set(text2.split())
    
    # Calculate Jaccard similarity
    if not set1 or not set2:
        return 0.0
    
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    
    return intersection / union if union > 0 else 0.0


def highlight_matching_tokens(query: str, target: str) -> List[str]:
    query_tokens = set(normalize_text(query).split())
    target_tokens = set(normalize_text(target).split())
    
    return list(query_tokens & target_tokens)
