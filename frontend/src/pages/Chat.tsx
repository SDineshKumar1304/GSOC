import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { chatWithResume } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I have analyzed your resume. Ask me anything about your experience, skills, or how to improve.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await chatWithResume(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.report }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the brain." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[80vh] flex flex-col max-w-4xl mx-auto">
        <div className="mb-6">
            <h2 className="text-3xl font-bold">RAG Agent</h2>
            <p className="text-white/40 font-mono text-sm">INTERACTIVE_SESSION_ACTIVE</p>
        </div>

        <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start gap-3 max-w-[80%]`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center border border-neon-purple/50">
                                        <Bot size={16} className="text-neon-purple" />
                                    </div>
                                )}
                                <div className={`p-4 rounded-2xl ${
                                    msg.role === 'user' 
                                    ? 'bg-white text-black' 
                                    : 'bg-white/5 border border-white/10'
                                }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                        <User size={16} className="text-black" />
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
                         <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center border border-neon-purple/50">
                                 <Bot size={16} className="text-neon-purple" />
                             </div>
                             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-2">
                                 <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                                 <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-75" />
                                 <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150" />
                             </div>
                         </div>
                     </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/20 backdrop-blur-md border-t border-white/10">
                <form 
                    className="flex gap-4 relative"
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about candidate's experience..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                    />
                    <button 
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-2 p-2 bg-white text-black rounded-lg hover:bg-white/90 disabled:opacity-50 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </GlassCard>
    </div>
  );
};
