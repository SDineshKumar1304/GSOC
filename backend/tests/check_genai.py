
import sys
import os

try:
    import google.generativeai as genai
    print("SUCCESS: google.generativeai imported.")
    
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    print(f"Model created: {model}")
    
    if hasattr(model, 'generate_content'):
        print("Model has 'generate_content' method.")
        
    # Wrappper to match .generate(prompt) signature expected by tools
    class ModelWrapper:
        def __init__(self, model):
            self.model = model
            
        def generate(self, prompt):
            response = self.model.generate_content(prompt)
            return response.text
            
    wrapper = ModelWrapper(model)
    print("Wrapper created.")
    
except Exception as e:
    print(f"Error: {e}")
