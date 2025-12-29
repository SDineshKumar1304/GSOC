
import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

try:
    # Import agent first to trigger the patching
    from app.services.agent import root_agent
    from app.services.available_tools import summarize_resume
    
    print("Checking tool attributes...")
    if hasattr(summarize_resume, 'llm'):
        print("SUCCESS: summarize_resume has 'llm' attribute.")
        print(f"Type of llm: {type(summarize_resume.llm)}")
    else:
        print("FAILURE: summarize_resume still missing 'llm' attribute.")

except Exception as e:
    print(f"Error: {e}")
