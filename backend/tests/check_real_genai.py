
import sys
import os

try:
    from google.genai import Client
    print("SUCCESS: google.genai Client imported.")
    
    client = Client()
    print("Client created.")
    
    # Try a simple generation if possible? 
    # Or just check methods
    if hasattr(client.models, 'generate_content'):
        print("client.models has generate_content")
        
except Exception as e:
    print(f"Error: {e}")
