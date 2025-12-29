import os
import shutil
import tempfile
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from app.models import (
    ResumeTextRequest, JobRequest, ChatRequest,
    ATSResponse, AnalysisResponse, OptimizationResponse,
    JobSearchResponse
)
from app.services.available_tools import (
    extract_text, rag_store_resume, rag_query,
    ats_report, ats_ai_feedback, summarize_resume,
    optimize_resume, latex_resume_preview, search_jobs
)
from app.services.agent import root_agent # Initialize agent to setup tools

app = FastAPI(title="Resumini API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Resumini API is running"}

@app.post("/upload/file")
async def upload_resume_file(file: UploadFile = File(...)):
    # Save upload file to temp
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        # Extract text
        result = extract_text(tmp_path)
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["error_message"])
        
        text = result["report"]
        
        # Store in RAG
        rag_result = rag_store_resume(text)
        
        return {
            "status": "success", 
            "extracted_text": text[:500] + "...", # Preview
            "rag_status": rag_result,
            "message": "Resume processed and stored in memory."
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/upload/text")
async def upload_resume_text(request: ResumeTextRequest):
    text = request.text
    rag_result = rag_store_resume(text)
    return {
        "status": "success",
        "rag_status": rag_result,
        "message": "Resume text stored in memory."
    }

@app.post("/analyze/summary", response_model=AnalysisResponse)
async def get_summary(request: ResumeTextRequest):
    result = summarize_resume(request.text)
    if result.get("status") == "error":
         raise HTTPException(status_code=500, detail=str(result))
    return AnalysisResponse(status="success", report=result["report"])

@app.post("/analyze/ats", response_model=ATSResponse)
async def get_ats_score(
    resume_text: str = Body(..., embed=True),
    role: str = Body(..., embed=True),
    job_description: Optional[str] = Body(None, embed=True)
):
    # 1. Heuristic Report
    heuristic = ats_report(resume_text, role)
    report_data = heuristic["ats_report"]
    
    # 2. AI Feedback (if JD provided)
    ai_feedback_text = None
    ai_score = None
    
    if job_description:
        ai_res = ats_ai_feedback(resume_text, job_description)
        ai_feedback_text = ai_res.get("report")
        ai_score = ai_res.get("score")

    return ATSResponse(
        status="success",
        role=role,
        ats_report=report_data,
        ai_feedback=ai_feedback_text,
        match_score=ai_score
    )

@app.post("/optimize", response_model=OptimizationResponse)
async def optimize(request: ResumeTextRequest, role: str = Body(..., embed=True)):
    # Note: The original tool writes to Desktop. We want to capture the content.
    # The tool returns 'report' containing the content.
    result = optimize_resume(request.text, role)
    if result["status"] == "error":
         raise HTTPException(status_code=500, detail=str(result))
    
    return OptimizationResponse(
        status="success",
        optimized_content=result["report"]
    )

@app.post("/chat", response_model=AnalysisResponse)
async def chat_rag(request: ChatRequest):
    result = rag_query(request.query, request.top_k)
    if result.get("status") == "error":
         raise HTTPException(status_code=400, detail=result["error_message"])
    return AnalysisResponse(status="success", report=result["report"])

@app.post("/jobs", response_model=JobSearchResponse)
async def search_linkedin(request: JobRequest):
    result = search_jobs(request.role, request.location)
    if result["status"] == "error":
          raise HTTPException(status_code=500, detail=result.get("error_message", "Unknown error"))
    return JobSearchResponse(status="success", jobs=result["report"])

@app.post("/preview/latex")
async def latex_preview(request: ResumeTextRequest, role: str = Body(..., embed=True)):
    result = latex_resume_preview(request.text, role)
    return result # Returns dict with pdf_base64, html_preview, etc.
