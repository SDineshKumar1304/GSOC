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
