import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, Loader2, MessageSquare, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { uploadResume } from '../services/api';

export const Home = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadResume(file);
      if (res.data.status === 'success') {
        // Store resume data context (using local storage for simplicity for now)
        localStorage.setItem('resumeText', res.data.extracted_text);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload resume. Please check the backend connection.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
          RESUMINI
        </h1>
        <p className="text-xl md:text-2xl text-white/60 font-mono tracking-wide">
          AI-POWERED RESUME INTELLIGENCE
        </p>
      </motion.div>

      <GlassCard className="w-full max-w-2xl min-h-[300px] flex flex-col items-center justify-center p-12 gap-6 relative">
        <form
          className="absolute inset-0 z-10 w-full h-full"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleChange}
          />
          {dragActive && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-20 border-2 border-neon-blue rounded-2xl animate-pulse" />
          )}
        </form>

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-16 h-16 text-neon-blue animate-spin" />
              <p className="text-lg font-mono animate-pulse">ANALYZING DOCUMENT...</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6 pointer-events-none"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <Upload className="w-10 h-10 text-white/80" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Drop your resume here</h3>
                <p className="text-white/40">Support for PDF & DOCX</p>
              </div>
              <Button
                className="mt-4 pointer-events-auto z-30"
                variant="neon"
                onClick={() => inputRef.current?.click()}
              >
                Select File
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
        {[
          { icon: FileText, title: 'Smart Parsing', desc: 'Extracts full context' },
          { icon: CheckCircle, title: 'ATS Scoring', desc: 'Optimize for keywords' },
          { icon: MessageSquare, title: 'RAG Chat', desc: 'Talk to your resume' },
        ].map((feature: { icon: LucideIcon; title: string; desc: string }, i) => (
          <GlassCard key={i} className="flex flex-col items-center p-6 gap-3" hoverEffect>
            <feature.icon className="w-8 h-8 text-white/60 mb-2" />
            <h4 className="text-lg font-bold">{feature.title}</h4>
            <p className="text-sm text-white/40">{feature.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
