
import sys
import os

sys.path.append(os.getcwd())

try:
    from google.adk.models.google_llm import GoogleGenAI
    print("SUCCESS: GoogleGenAI imported.")
    
    # Try to verify if we can list its methods
    print(f"Dir: {dir(GoogleGenAI)}")
    
except Exception as e:
    print(f"Error importing GoogleGenAI: {e}")

try:
    from google.adk.models.registry import ModelRegistry
    print("SUCCESS: ModelRegistry imported.")
    print(f"Registry: {ModelRegistry}")
except Exception as e:
    print(f"Error importing ModelRegistry: {e}")
