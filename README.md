# Resumini - AI Powered Resume Agent

Resumini is a powerful AI agent designed to help candidates optimize their resumes for Applicant Tracking Systems (ATS). It uses Google's Gemini models (via `google-adk`) to analyze, summarize, score, and rewrite resumes.

## Features

- **Resume Parsing**: Extract text from PDF, DOCX, and plain text files.
- **RAG (Retrieval-Augmented Generation)**: Store resumes in memory and ask questions about them.
- **ATS Analysis**: Get a heuristic score and AI-driven feedback on how well a resume matches a job description.
- **Professional Summary**: Generate concise, recruiter-friendly summaries.
- **Resume Optimization**: Rewrite resume content to better align with a specific job role.
- **Job Search**: Search for relevant jobs on LinkedIn (requires Chrome/Selenium).
- **LaTeX Preview**: Generate a professional LaTeX/PDF version of the resume.

## Prerequisites

- Python 3.10+
- [Google Cloud Project](https://console.cloud.google.com/) with Vertex AI enabled (for `google-adk`).
- `pdflatex` (optional, for PDF generation).

## Installation

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd GSOC
    ```

2.  **Install dependencies**:
    Using `uv` (recommended):
    ```bash
    uv sync
    ```
    Or using `pip`:
    ```bash
    pip install -r requirements.txt
    ```

## Configuration

Ensure you have your Google Cloud credentials set up for `google-adk`. You may need to set environment variables or use `gcloud auth application-default login`.

## Usage

Start the FastAPI server:

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### API Documentation

- **Swagger UI**: Visit `http://127.0.0.1:8000/docs` for interactive API testing.
- **Detailed Docs**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md).
- **Postman**: Import `resumini_postman_collection.json` into Postman.

## Project Structure

- `app/`: Core application logic.
  - `main.py`: FastAPI entry point.
  - `models.py`: Pydantic data models.
  - `services/`: Agent logic and tools.
- `tests/`: Test scripts.
- `requirements.txt`: Python dependencies.
