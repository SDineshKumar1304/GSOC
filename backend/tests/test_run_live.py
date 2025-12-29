
import sys
import os

sys.path.append(os.getcwd())

from app.services.agent import root_agent

try:
    print("Testing root_agent.run_live...")
    # It might return a generator or a result object
    result = root_agent.run_live("Hello, just say hi.")
    print(f"Result type: {type(result)}")
    
    # Iterate if it's a generator
    if hasattr(result, '__iter__'):
        for chunk in result:
            print(f"Chunk: {chunk}")
    else:
        print(f"Result: {result}")

except Exception as e:
    print(f"Error running agent: {e}")
