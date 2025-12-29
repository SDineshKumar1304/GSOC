
import sys
import os

sys.path.append(os.getcwd())

try:
    from app.services.agent import root_agent
    
    with open("debug_output.txt", "w") as f:
        f.write(f"Agent type: {type(root_agent)}\n")
        f.write(f"Dir list: {dir(root_agent)}\n")
        
        if hasattr(root_agent, '__dict__'):
            f.write(f"Dict keys: {list(root_agent.__dict__.keys())}\n")

except Exception as e:
    with open("debug_output.txt", "w") as f:
        f.write(f"Error: {e}")
