import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'cyan' | 'red' | 'green' | 'none';
  delay?: number;
}

export default function GlassPanel({ 
  children, 
  className = '', 
  hover = true,
  glow = 'none',
  delay = 0
}: GlassPanelProps) {
  const glowClass = {
    cyan: 'neon-glow-cyan',
    red: 'neon-glow-red',
    green: 'neon-glow-green',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        'glass-panel p-5 md:p-6 border border-border rounded-xl',
        glowClass[glow],
        hover && 'transition-all duration-300 hover:border-primary/40',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
