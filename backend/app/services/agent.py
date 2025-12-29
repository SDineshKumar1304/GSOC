from google.adk.agents import LlmAgent
from .available_tools import *


root_agent = LlmAgent(
    name="resumini_agent",
    model="gemini-2.5-flash",
    description="Full ATS Resume AI with LaTeX & RAG",
    instruction="Analyze resumes, optimize them, generate ATS reports, and preview LaTeX PDFs.",
    tools=[
        get_weather,
        get_current_time,
        extract_text,
        rag_store_resume,
        rag_query,
        ats_report,
        ats_ai_feedback,
        summarize_resume,
        optimize_resume,
        latex_resume_preview,
    search_jobs
    ]
)

# Manually inject the 'llm' attribute into tools because LlmAgent isn't doing it automatically.
# We wrap the agent to expose a synchronous .generate() method required by available_tools.py.

class AgentLLMWrapper:
    def __init__(self, agent):
        self.agent = agent

    def generate(self, prompt: str) -> str:
        # Resolve the model from the agent (converts string name to Gemini object)
        # canonical_model is a property on LlmAgent that returns the BaseLlm instance
        model_instance = self.agent.canonical_model
        
        # Access the underlying google.genai.Client
        # The Gemini class (in google_llm.py) exposes 'api_client'
        client = model_instance.api_client
        
        # Use the synchronous generation API
        # model_instance.model holds the model name string (e.g., 'gemini-2.5-flash')
        response = client.models.generate_content(
            model=model_instance.model,
            contents=prompt
        )
        return response.text

llm_interface = AgentLLMWrapper(root_agent)

tools_list = [
    get_weather, get_current_time, extract_text, rag_store_resume, 
    rag_query, ats_report, ats_ai_feedback, summarize_resume, 
    optimize_resume, latex_resume_preview, search_jobs
]

for tool in tools_list:
    # Some agents might wrap tools, so we need to be careful.
    # But available_tools.py refers to the functions by their original names.
    tool.llm = llm_interface
