
import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

try:
    from app.services.agent import root_agent
    from app.services.available_tools import summarize_resume
    
    print("--- DEBUG START ---")
    print(f"Agent type: {type(root_agent)}")
    
    # Check for generate method on agent
    if hasattr(root_agent, 'generate'):
        print("Agent has 'generate' method.")
    else:
        print("Agent does NOT have 'generate' method.")
        
    # Check for llm attribute
    if hasattr(root_agent, 'llm'):
        print("Agent has 'llm' attribute.")
        val = getattr(root_agent, 'llm')
        print(f"agent.llm type: {type(val)}")
        if hasattr(val, 'generate'):
            print("agent.llm has 'generate' method.")
        else:
            print("agent.llm does NOT have 'generate' method.")
    else:
        print("Agent does NOT have 'llm' attribute.")

    # List all attributes
    print("Agent directory:")
    for d in dir(root_agent):
        if not d.startswith('_'):
            print(f"- {d}")
            
    print("--- DEBUG END ---")

except Exception as e:
    print(f"Error: {e}")
