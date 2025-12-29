import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonProps = React.ComponentProps<typeof motion.button> & {
  variant?: 'glass' | 'neon' | 'ghost';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button = ({ className, variant = 'glass', children, icon, ...props }: ButtonProps) => {
  const variants = {
    glass: "glass-btn text-white",
    neon: "bg-white/90 text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] border-transparent font-medium",
    ghost: "bg-transparent hover:bg-white/5 text-white/70 hover:text-white border-transparent",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-xl backdrop-blur-sm border transition-all text-sm uppercase tracking-wider font-mono",
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </motion.button>
  );
};
