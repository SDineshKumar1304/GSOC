import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { chatWithResume } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I have analyzed the resume. Give me me a specific question or topic, and I can dig into the details for you.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await chatWithResume(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.report }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the brain." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[80vh] flex flex-col max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    RAG Agent <Sparkles className="text-neon-purple w-6 h-6 animate-pulse" />
                </h2>
                <p className="text-white/40 font-mono text-sm mt-1">INTERACTIVE_SESSION_ACTIVE // BRAIN_CONNECTED</p>
            </div>
        </div>

        <GlassCard className="flex-1 p-0 overflow-hidden relative border-white/10 shadow-2xl">
            <div className="flex flex-col h-full">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start gap-4 max-w-[85%] md:max-w-[75%]`}>
                                    {msg.role === 'assistant' && (
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-lg shrink-0">
                                            <Bot size={20} className="text-neon-purple" />
                                        </div>
                                    )}
                                    <div className={`p-5 rounded-2xl shadow-xl backdrop-blur-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white border border-white/10' 
                                        : 'bg-white/5 border border-white/10 text-white/90'
                                    }`}>
                                        {msg.role === 'assistant' ? (
                                            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-li:marker:text-neon-purple">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        )}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                            <User size={20} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                             <motion.div
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="flex justify-start"
                         >
                             <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center border border-neon-purple/50 shrink-0">
                                     <Bot size={20} className="text-neon-purple animate-pulse" />
                                 </div>
                                 <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-2 items-center h-[50px]">
                                     <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                     <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                     <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                 </div>
                             </div>
                         </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-white/10">
                    <form 
                        className="flex gap-4 relative"
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask deeply about the candidate's skills, experience, or projects..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all font-sans text-sm md:text-base text-white placeholder:text-white/30 shadow-inner"
                        />
                        <button 
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-3 top-3 bottom-3 aspect-square bg-gradient-to-r from-neon-purple to-neon-blue text-white rounded-lg hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 transition-all flex items-center justify-center shadow-lg transform active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </GlassCard>
    </div>
  );
};
