import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type GlassCardProps = React.ComponentProps<typeof motion.div> & {
  className?: string;
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const GlassCard = ({ className, children, hoverEffect = false, ...props }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hoverEffect ? { scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' } : {}}
      className={cn(
        "glass-panel rounded-2xl p-6 relative overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/40 to-transparent" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
