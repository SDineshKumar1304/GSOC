import { useEffect, useState } from "react";

import { FileText, AlertTriangle } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { getSummary, getATSScore, type ATSResponse } from "../services/api";
import ReactMarkdown from "react-markdown";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "ats">("overview");
  const [summary, setSummary] = useState<string>("");
  const [atsData, setAtsData] = useState<ATSResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async (text: string) => {
      setLoading(true);
      try {
        const res = await getSummary(text);
        setSummary(res.data.report);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const fetchATS = async (text: string) => {
      setLoading(true);
      try {
        const res = await getATSScore(
          text, 
          "Software Engineer", 
          "We are looking for a Software Engineer with experience in Python, JavaScript, and React. The candidate should have knowledge of web development, databases (SQL/NoSQL), and cloud platforms like AWS. Strong problem-solving skills and experience with Git/Agile workflows are required."
        );
        setAtsData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    // Determine if we have data or need to fetch
    const resumeText = localStorage.getItem("resumeText");
    if (resumeText) {
      if (activeTab === "overview" && !summary) {
        fetchSummary(resumeText);
      } else if (activeTab === "ats" && !atsData) {
        fetchATS(resumeText);
      }
    }
  }, [activeTab, summary, atsData]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-white/40 font-mono mt-2">RESUME_ID: 8X92-A1</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl backdrop-blur-md border border-white/10">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-white/10 text-white shadow-lg"
                : "text-white/40 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("ats")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "ats"
                ? "bg-white/10 text-white shadow-lg"
                : "text-white/40 hover:text-white"
            }`}
          >
            ATS Score
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === "overview" && (
            <GlassCard className="min-h-[400px]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-neon-purple" />
                Executive Summary
              </h3>
              {loading ? (
                <div className="h-full flex items-center justify-center animate-pulse text-white/40 font-mono">
                  GENERATING_REPORT...
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-white/80 leading-relaxed">
                  <ReactMarkdown>
                    {summary || "No summary available. Upload a resume first."}
                  </ReactMarkdown>
                </div>
              )}
            </GlassCard>
          )}

          {activeTab === "ats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white/5 to-transparent">
                  <span className="text-sm text-white/40 uppercase font-mono mb-2">
                    Total Score
                  </span>
                  <span className="text-6xl font-bold text-neon-blue">
                    {atsData?.ats_report.overall_score || 0}
                  </span>
                </GlassCard>
                <GlassCard className="flex flex-col items-center justify-center p-6">
                  <span className="text-sm text-white/40 uppercase font-mono mb-2">
                    Keywords
                  </span>
                  <span className="text-4xl font-bold">
                    {atsData?.ats_report.keyword_score || 0}%
                  </span>
                </GlassCard>
                <GlassCard className="flex flex-col items-center justify-center p-6">
                  <span className="text-sm text-white/40 uppercase font-mono mb-2">
                    Match
                  </span>
                  <span className="text-4xl font-bold">
                    {atsData?.match_score || 0}%
                  </span>
                </GlassCard>
              </div>

              <GlassCard>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-neon-red" />
                  AI Feedback
                </h3>
                <p className="text-white/70 whitespace-pre-wrap">
                  {atsData?.ai_feedback || "Loading feedback..."}
                </p>
              </GlassCard>
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <GlassCard className="p-4">
            <h4 className="font-bold text-sm uppercase text-white/40 mb-4">
              Quick Actions
            </h4>
            <div className="space-y-2">
              <Button variant="glass" className="w-full justify-start text-xs">
                Run Optimizer
              </Button>
              <Button variant="glass" className="w-full justify-start text-xs">
                Export PDF
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
