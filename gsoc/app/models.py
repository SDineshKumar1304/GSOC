from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ResumeTextRequest(BaseModel):
    text: str = Field(..., description="Raw text of the resume")

class JobRequest(BaseModel):
    role: str = Field(..., description="Target job role")
    location: str = Field("India", description="Job location for search")
    description: Optional[str] = Field(None, description="Full job description for detailed matching")

class ChatRequest(BaseModel):
    query: str = Field(..., description="Question to ask about the uploaded resume")
    top_k: int = Field(4, description="Number of context chunks to retrieve")

class ATSReport(BaseModel):
    overall_score: float
    keyword_score: float
    structure_score: float
    length_score: float

class ATSResponse(BaseModel):
    status: str
    role: str
    ats_report: ATSReport
    ai_feedback: Optional[str] = None
    match_score: Optional[int] = None

class AnalysisResponse(BaseModel):
    status: str
    report: str

class OptimizationResponse(BaseModel):
    status: str
    # file_path: Optional[str] = None # We might return text or a link instead
    optimized_content: str

class JobListing(BaseModel):
    title: str
    company: str
    link: str

class JobSearchResponse(BaseModel):
    status: str
    jobs: List[JobListing]
