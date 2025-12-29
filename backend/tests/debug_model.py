
import sys
import os

sys.path.append(os.getcwd())

try:
    from app.services.agent import root_agent
    
    print("--- DEBUG MODEL START ---")
    if hasattr(root_agent, 'canonical_model'):
        model = root_agent.canonical_model
        print(f"Canonical Model type: {type(model)}")
        print(f"Canonical Model dir: {dir(model)}")
        
        if hasattr(model, 'generate_content'):
            print("FOUND generate_content")
        if hasattr(model, 'generate'):
            print("FOUND generate")
            
    else:
        print("No canonical_model attribute.")
        
    print("--- DEBUG MODEL END ---")

except Exception as e:
    print(f"Error: {e}")
