
import sys
import os

sys.path.append(os.getcwd())

try:
    from app.services.agent import root_agent, AgentLLMWrapper
    from app.services.available_tools import summarize_resume
    
    print("Checking tool attributes...")
    if hasattr(summarize_resume, 'llm'):
        print("SUCCESS: summarize_resume has 'llm' attribute.")
        print(f"Type of llm: {type(summarize_resume.llm)}")
        
        if isinstance(summarize_resume.llm, AgentLLMWrapper):
            print("SUCCESS: llm is instance of AgentLLMWrapper")
        else:
            print(f"FAILURE: llm is {type(summarize_resume.llm)}")
            
        # Check if generate method exists
        if hasattr(summarize_resume.llm, 'generate'):
             print("SUCCESS: llm has 'generate' method.")
        else:
             print("FAILURE: llm missing 'generate' method.")

    else:
        print("FAILURE: summarize_resume still missing 'llm' attribute.")

except Exception as e:
    print(f"Error: {e}")
