
import sys
import os

sys.path.append(os.getcwd())

try:
    from app.services.agent import root_agent
    
    print("--- DEBUG SAFE START ---")
    print(f"Dir list: {dir(root_agent)}")
    print("--- DEBUG SAFE END ---")

except Exception as e:
    print(f"Error: {e}")
