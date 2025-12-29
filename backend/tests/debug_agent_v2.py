
import sys
import os
import inspect

# Add the project root to sys.path
sys.path.append(os.getcwd())

try:
    from app.services.agent import root_agent
    
    print("--- DEBUG V2 START ---")
    print(f"Agent type: {type(root_agent)}")
    print(f"Agent vars: {vars(root_agent)}")
    
    print("\n--- DIR(root_agent) ---")
    for d in dir(root_agent):
        print(f"{d}: {getattr(root_agent, d)}")
        
    print("--- DEBUG V2 END ---")

except Exception as e:
    print(f"Error: {e}")
