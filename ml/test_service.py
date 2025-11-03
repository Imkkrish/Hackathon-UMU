import requests
import time
import sys
from pathlib import Path

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def colored(text, color):
    colors = {
        'green': '\033[92m',
        'red': '\033[91m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'reset': '\033[0m'
    }
    return f"{colors.get(color, '')}{text}{colors['reset']}"

def test_health():
    """Test health endpoint"""
    print("\n" + "="*60)
    print(colored("TEST 1: Health Check", 'blue'))
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            print(colored("✓ Service is healthy", 'green'))
            print(f"  Model loaded: {data.get('model_loaded')}")
            print(f"  Index loaded: {data.get('index_loaded')}")
            print(f"  Total records: {data.get('total_records')}")
            return True
        else:
            print(colored("✗ Health check failed", 'red'))
            return False
    except Exception as e:
        print(colored(f"✗ Error: {e}", 'red'))
        return False

def test_normalize():
    """Test normalization endpoint"""
    print("\n" + "="*60)
    print(colored("TEST 2: Address Normalization", 'blue'))
    print("="*60)
    
    test_cases = [
        "Kothimir PO, Asifabad Dist, TG-504273",
        "koramangala bangalore 560034",
        "Mr. John S/O Ram, Gurgaon Near DLF Phase 2, HR"
    ]
    
    passed = 0
    for address in test_cases:
        try:
            response = requests.post(
                f"{BASE_URL}/api/ml/normalize",
                json={"text": address},
                timeout=TIMEOUT
            )
            if response.status_code == 200:
                data = response.json()
                print(colored(f"\n✓ Test passed", 'green'))
                print(f"  Original: {data['original']}")
                print(f"  Cleaned:  {data['cleaned']}")
                passed += 1
            else:
                print(colored(f"✗ Failed for: {address}", 'red'))
        except Exception as e:
            print(colored(f"✗ Error: {e}", 'red'))
    
    print(f"\nPassed: {passed}/{len(test_cases)}")
    return passed == len(test_cases)

def test_match():
    """Test address matching endpoint"""
    print("\n" + "="*60)
    print(colored("TEST 3: Address Matching", 'blue'))
    print("="*60)
    
    test_cases = [
        {
            "text": "Kothimir post office Asifabad Telangana",
            "expected_pincode": "504273"
        },
        {
            "text": "koramangala bangalore 560034",
            "expected_pincode": "560034"
        },
        {
            "text": "Connaught Place New Delhi",
            "expected_pincode": "110001"
        }
    ]
    
    passed = 0
    for test in test_cases:
        try:
            response = requests.post(
                f"{BASE_URL}/api/ml/match",
                json={"text": test["text"], "top_k": 3},
                timeout=TIMEOUT
            )
            if response.status_code == 200:
                data = response.json()
                matches = data.get('matches', [])
                
                if matches:
                    top_match = matches[0]
                    print(colored(f"\n✓ Match found", 'green'))
                    print(f"  Query: {test['text']}")
                    print(f"  Top Result:")
                    print(f"    Office: {top_match['officename']}")
                    print(f"    PIN: {top_match['pincode']}")
                    print(f"    District: {top_match['district']}")
                    print(f"    State: {top_match['state']}")
                    print(f"    Confidence: {top_match['confidence']:.2%}")
                    print(f"    Processing time: {data.get('processing_time_ms', 0):.2f}ms")
                    
                    # Check if expected PIN is in top 3
                    found_pins = [m['pincode'] for m in matches]
                    if test['expected_pincode'] in found_pins:
                        print(colored(f"  ✓ Expected PIN found in top {found_pins.index(test['expected_pincode'])+1}", 'green'))
                        passed += 1
                    else:
                        print(colored(f"  ⚠ Expected PIN {test['expected_pincode']} not in top 3", 'yellow'))
                        print(f"  Got PINs: {found_pins}")
                else:
                    print(colored(f"✗ No matches found for: {test['text']}", 'red'))
            else:
                print(colored(f"✗ Request failed: {response.status_code}", 'red'))
        except Exception as e:
            print(colored(f"✗ Error: {e}", 'red'))
    
    print(f"\nPassed: {passed}/{len(test_cases)}")
    return passed >= len(test_cases) - 1  # Allow 1 failure

def test_performance():
    """Test performance metrics"""
    print("\n" + "="*60)
    print(colored("TEST 4: Performance Metrics", 'blue'))
    print("="*60)
    
    test_text = "Koramangala Bangalore Karnataka 560034"
    times = []
    
    print("Running 10 requests...")
    for i in range(10):
        try:
            start = time.time()
            response = requests.post(
                f"{BASE_URL}/api/ml/match",
                json={"text": test_text, "top_k": 5},
                timeout=TIMEOUT
            )
            elapsed = (time.time() - start) * 1000
            times.append(elapsed)
            print(f"  Request {i+1}: {elapsed:.2f}ms")
        except Exception as e:
            print(colored(f"  Request {i+1} failed: {e}", 'red'))
    
    if times:
        avg_time = sum(times) / len(times)
        min_time = min(times)
        max_time = max(times)
        
        print(f"\nPerformance Summary:")
        print(f"  Average: {avg_time:.2f}ms")
        print(f"  Min: {min_time:.2f}ms")
        print(f"  Max: {max_time:.2f}ms")
        
        if avg_time < 500:
            print(colored("✓ Performance target met (< 500ms)", 'green'))
            return True
        else:
            print(colored("⚠ Performance below target", 'yellow'))
            return False
    else:
        print(colored("✗ No successful requests", 'red'))
        return False

def wait_for_service(max_wait=120):
    """Wait for service to be ready"""
    print(colored("\nWaiting for ML service to start...", 'yellow'))
    print("(This may take 30-90s on first run while downloading models)")
    
    start_time = time.time()
    while time.time() - start_time < max_wait:
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'healthy':
                    print(colored("✓ Service is ready!", 'green'))
                    return True
        except:
            pass
        
        elapsed = int(time.time() - start_time)
        print(f"  Waiting... ({elapsed}s)", end='\r')
        time.sleep(2)
    
    print(colored("\n✗ Service did not start in time", 'red'))
    return False

def main():
    print(colored("\n" + "="*60, 'blue'))
    print(colored("  ML Service Test Suite - Challenge 1", 'blue'))
    print(colored("="*60 + "\n", 'blue'))
    
    # Wait for service
    if not wait_for_service():
        print(colored("\n✗ Service not available. Please start with:", 'red'))
        print("  python main.py")
        print("  or")
        print("  docker-compose up ml-service")
        sys.exit(1)
    
    # Run tests
    results = []
    results.append(("Health Check", test_health()))
    results.append(("Normalization", test_normalize()))
    results.append(("Address Matching", test_match()))
    results.append(("Performance", test_performance()))
    
    # Summary
    print("\n" + "="*60)
    print(colored("TEST SUMMARY", 'blue'))
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = colored("✓ PASS", 'green') if result else colored("✗ FAIL", 'red')
        print(f"{test_name:20s} {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print(colored("\n🎉 All tests passed! Challenge 1 implementation is working!", 'green'))
        sys.exit(0)
    else:
        print(colored(f"\n⚠ {total - passed} test(s) failed", 'yellow'))
        sys.exit(1)

if __name__ == "__main__":
    main()
