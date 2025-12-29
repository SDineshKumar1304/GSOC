import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export interface UploadResponse {
  status: string;
  extracted_text: string;
  rag_status: Record<string, any>;
  message: string;
}

export interface SummaryResponse {
  status: string;
  report: string;
}

export interface ATSResponse {
    status: string;
    ats_report: {
        overall_score: number;
        keyword_score: number;
        structure_score?: number;
        formatting_score?: number;
    };
    ai_feedback: string;
    match_score: number;
}

export interface ChatResponse {
  status: string;
  report: string;
}

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<UploadResponse>('/upload/file', formData);
};

export const getSummary = async (text: string) => {
  return api.post<SummaryResponse>('/analyze/summary', { text });
};

export const getATSScore = async (resume_text: string, role: string, job_description?: string) => {
    return api.post<ATSResponse>('/analyze/ats', { resume_text, role, job_description });
};

export const chatWithResume = async (query: string) => {
  return api.post<ChatResponse>('/chat', { query, top_k: 4 });
};

export default api;
