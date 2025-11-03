# Model Persistence - Visual Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     ML Service Startup                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Load Dataset   │
                    │   (CSV File)    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │  Load ML Model  │
                    │  (Transformer)  │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Cache Exists?   │
                    └────────┬────────┘
                             ↓
                ┌────────────┴────────────┐
                │                         │
              YES                        NO
                │                         │
        ┌───────▼────────┐       ┌───────▼────────┐
        │  Load Cache    │       │  Build Index   │
        │   (5-10s)      │       │  (30-60s)      │
        │                │       │                │
        │ • faiss.index  │       │ • Embeddings   │
        │ • metadata.pkl │       │ • FAISS build  │
        └───────┬────────┘       └───────┬────────┘
                │                         │
                │                ┌────────▼────────┐
                │                │   Save Cache    │
                │                │  to ./cache/    │
                │                └────────┬────────┘
                │                         │
                └─────────┬───────────────┘
                          ↓
                ┌─────────────────┐
                │  Service Ready  │
                │  Handle Requests│
                └─────────────────┘
```

## First Run vs Subsequent Runs

### First Run (Cold Start) - 30-60 seconds
```
Time: 0s
  ├─ Load Dataset (5s)
  │  └─ 165,000 post office records
  │
Time: 5s
  ├─ Load ML Model (10s)
  │  └─ sentence-transformers/all-MiniLM-L6-v2
  │
Time: 15s
  ├─ Build FAISS Index (40s)
  │  ├─ Generate embeddings (384-dim)
  │  ├─ Normalize vectors
  │  └─ Build similarity index
  │
Time: 55s
  ├─ Save to Cache (5s)
  │  ├─ cache/faiss.index (250MB)
  │  └─ cache/metadata.pkl (50MB)
  │
Time: 60s
  └─ ✅ Service Ready
```

### Subsequent Run (Warm Start) - 5-10 seconds
```
Time: 0s
  ├─ Load Dataset (2s)
  │  └─ 165,000 post office records
  │
Time: 2s
  ├─ Load ML Model (3s)
  │  └─ sentence-transformers/all-MiniLM-L6-v2
  │
Time: 5s
  ├─ Load from Cache (5s)
  │  ├─ cache/faiss.index (250MB)
  │  └─ cache/metadata.pkl (50MB)
  │
Time: 10s
  └─ ✅ Service Ready
```

## Cache Directory Structure

```
ml/
├── main.py
├── requirements.txt
├── models/
│   └── matcher.py          # ← Cache logic here
├── cache/                   # ← Auto-created
│   ├── faiss.index         # 250MB - Similarity index
│   └── metadata.pkl        # 50MB - Post office data
├── manage_cache.py         # ← Utility script
└── .gitignore              # ← Excludes cache/
```

## File Sizes

```
┌─────────────────┬────────────┐
│ File            │ Size       │
├─────────────────┼────────────┤
│ faiss.index     │ ~250 MB    │
│ metadata.pkl    │ ~50 MB     │
│ embeddings.npy  │ (optional) │
├─────────────────┼────────────┤
│ Total Cache     │ ~300 MB    │
└─────────────────┴────────────┘
```

## Performance Comparison

```
Startup Time (seconds)
0    10   20   30   40   50   60
│────│────│────│────│────│────│
│
│ First Run    ████████████████████████████████ 30-60s
│
│ With Cache   █████ 5-10s
│
└────────────────────────────────────────────────
                6x Faster! ⚡
```

## Cache Lifecycle

```
┌─────────────────────────────────────────────────────┐
│                   Cache Lifecycle                    │
└─────────────────────────────────────────────────────┘

1. Service Starts
   ↓
2. Check: Does ./cache/ exist?
   ↓
   ├─ YES → Load from cache (fast)
   │        └─ Service ready in 5-10s
   │
   └─ NO → Build from scratch
            ├─ Generate embeddings
            ├─ Build FAISS index
            ├─ Save to cache
            └─ Service ready in 30-60s

3. Cache persists on disk
   ↓
4. Next startup → Load from cache (fast)
   ↓
5. Dataset updated?
   ├─ YES → Clear cache, rebuild
   └─ NO → Keep using cache
```

## Docker Volume Mapping

```
Host Machine                Docker Container
─────────────                ────────────────

./ml/cache/      ←──────→   /app/cache/
├── faiss.index             ├── faiss.index
└── metadata.pkl            └── metadata.pkl

                Docker Volume: ml-faiss-cache
                ├── Persists across restarts
                └── Survives container deletion
```

## Cache Operations Flow

```
┌────────────────────────────────────────┐
│      Cache Management Commands         │
└────────────────────────────────────────┘

Check Status:
  python manage_cache.py check
    ↓
  Shows:
    • Cache exists: YES/NO
    • Files: faiss.index, metadata.pkl
    • Sizes: 250MB, 50MB
    • Total: 300MB

Clear Cache:
  python manage_cache.py clear
    ↓
  Removes:
    • ./cache/ directory
    • All cached files
    ↓
  Next startup:
    • Rebuilds from scratch
    • Saves new cache
```

## Data Flow During Matching

```
┌───────────────────────────────────────────────────┐
│          Address Matching with Cache              │
└───────────────────────────────────────────────────┘

Query: "Kothimir PO Asifabad"
  ↓
┌─────────────────┐
│ Text Processing │
│ • Normalize     │
│ • Clean         │
└────────┬────────┘
         ↓
┌─────────────────┐
│ ML Model        │
│ • Encode query  │
│ • 384-dim vector│
└────────┬────────┘
         ↓
┌─────────────────┐
│ FAISS Index     │  ← Loaded from cache (fast!)
│ • Search index  │
│ • Find similar  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Metadata        │  ← Loaded from cache (fast!)
│ • Get details   │
│ • Calculate conf│
└────────┬────────┘
         ↓
Results: Top 5 matches
```

## Memory Usage

```
Component                Memory
─────────────────────────────────
ML Model                 500 MB
FAISS Index              250 MB
Metadata                 50 MB
Runtime Data             200 MB
─────────────────────────────────
Total                    ~1 GB

Note: Cache on disk (300MB) ≠ Memory usage
```

## Key Points

```
┌──────────────────────────────────────────────┐
│              Key Takeaways                   │
└──────────────────────────────────────────────┘

✅ Automatic       No manual steps needed
✅ Fast            6x faster startup
✅ Safe            Auto-rebuild if missing
✅ Docker-friendly Persists across restarts
✅ Space-efficient Only 300MB disk usage
✅ No accuracy loss Same results
```

## When Cache is Used

```
✅ Cache Loaded:
  • Cache files exist
  • Files not corrupted
  • Correct permissions
  • Sufficient memory

❌ Cache Rebuilt:
  • First run ever
  • Cache cleared manually
  • Files corrupted
  • Dataset changed
  • Model changed
```

---

For more details, see:
- **CACHE_PERSISTENCE.md** - Complete guide
- **IMPLEMENTATION_COMPLETE.md** - Quick summary
- **README.md** - Full documentation
