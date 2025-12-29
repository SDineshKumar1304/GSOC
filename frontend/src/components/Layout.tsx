import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LineChart, MessageSquare, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

const NavItem = ({ to, icon: Icon, label, active }: { to: string; icon: LucideIcon; label: string; active: boolean }) => (
  <Link to={to}>
    <motion.div
      className={clsx(
        "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
        active ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20" : "text-white/40 hover:text-white hover:bg-white/5"
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-[10px] font-mono uppercase">{label}</span>
    </motion.div>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-white/20">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-blue-900/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-red-900/20 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <nav className="w-24 border-r border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center py-8 gap-8 hidden md:flex">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-white to-gray-500 mb-8" />
            
            <div className="flex flex-col gap-4">
                <NavItem to="/" icon={Home} label="Home" active={location.pathname === '/'} />
                <NavItem to="/dashboard" icon={LineChart} label="Stats" active={location.pathname === '/dashboard'} />
                <NavItem to="/chat" icon={MessageSquare} label="Chat" active={location.pathname === '/chat'} />
            </div>
        </nav>

        {/* Mobile Nav (Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center px-4 z-50">
            <NavItem to="/" icon={Home} label="Home" active={location.pathname === '/'} />
            <NavItem to="/dashboard" icon={LineChart} label="Stats" active={location.pathname === '/dashboard'} />
            <NavItem to="/chat" icon={MessageSquare} label="Chat" active={location.pathname === '/chat'} />
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 md:pb-8 pb-24">
            {children}
        </main>
      </div>
    </div>
  );
};
