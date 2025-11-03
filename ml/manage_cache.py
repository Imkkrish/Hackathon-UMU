#!/usr/bin/env python3
"""
Cache Management Utility
Clear or check the status of the ML service cache
"""

import os
import sys
import shutil
from pathlib import Path

CACHE_DIR = Path(__file__).parent / "cache"

def get_cache_size(path: Path) -> int:
    """Get size of cache directory in bytes"""
    total = 0
    if path.exists():
        for file in path.rglob('*'):
            if file.is_file():
                total += file.stat().st_size
    return total

def format_size(bytes: int) -> str:
    """Format bytes to human readable string"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024
    return f"{bytes:.2f} TB"

def check_cache():
    """Check cache status"""
    print(f"Cache directory: {CACHE_DIR}")
    
    if not CACHE_DIR.exists():
        print("❌ Cache directory does not exist")
        return
    
    faiss_index = CACHE_DIR / "faiss.index"
    metadata = CACHE_DIR / "metadata.pkl"
    embeddings = CACHE_DIR / "embeddings.npy"
    
    print("\n📊 Cache Status:")
    print(f"  Directory exists: ✅")
    
    files_found = []
    total_size = 0
    
    for file, name in [(faiss_index, "FAISS index"), 
                       (metadata, "Metadata"), 
                       (embeddings, "Embeddings")]:
        if file.exists():
            size = file.stat().st_size
            total_size += size
            files_found.append(name)
            print(f"  {name}: ✅ ({format_size(size)})")
        else:
            print(f"  {name}: ❌ (not found)")
    
    if files_found:
        print(f"\n📦 Total cache size: {format_size(total_size)}")
        print(f"✅ Cache is ready ({len(files_found)} file(s) found)")
    else:
        print("\n⚠️  Cache is empty - will be built on first run")

def clear_cache():
    """Clear cache directory"""
    if not CACHE_DIR.exists():
        print("✅ Cache directory does not exist - nothing to clear")
        return
    
    print(f"🗑️  Clearing cache directory: {CACHE_DIR}")
    
    try:
        shutil.rmtree(CACHE_DIR)
        print("✅ Cache cleared successfully")
        print("ℹ️  Cache will be rebuilt on next service startup")
    except Exception as e:
        print(f"❌ Failed to clear cache: {e}")
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python manage_cache.py check   - Check cache status")
        print("  python manage_cache.py clear   - Clear cache")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == "check":
        check_cache()
    elif command == "clear":
        confirm = input("⚠️  Are you sure you want to clear the cache? [y/N]: ")
        if confirm.lower() in ['y', 'yes']:
            clear_cache()
        else:
            print("❌ Cancelled")
    else:
        print(f"❌ Unknown command: {command}")
        print("Available commands: check, clear")
        sys.exit(1)

if __name__ == "__main__":
    main()
