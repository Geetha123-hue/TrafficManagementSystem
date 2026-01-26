import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import GlassPanel from './GlassPanel';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  suffix = '',
  prefix = '',
  icon,
  trend,
  trendValue,
  variant = 'default',
  delay = 0,
}: MetricCardProps) {
  const variantStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  const variantBg = {
    default: 'bg-primary/10 border-primary/20',
    success: 'bg-success/10 border-success/20',
    warning: 'bg-warning/10 border-warning/20',
    danger: 'bg-destructive/10 border-destructive/20',
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  const trendIcons = {
    up: <TrendingUp size={16} className="text-success" />,
    down: <TrendingDown size={16} className="text-destructive" />,
    neutral: <Minus size={16} className="text-muted-foreground" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <GlassPanel className="relative overflow-hidden border-border hover:border-primary/40 transition-colors h-full">
        {/* Gradient background accent */}
        <div className={cn('absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30', variantBg[variant])} />
        
        <div className="relative z-10 space-y-3">
          {/* Header with title and icon */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {title}
            </span>
            <motion.div 
              className={cn('p-2.5 rounded-lg border', variantBg[variant])}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={cn('text-base', variantStyles[variant])}>
                {icon}
              </div>
            </motion.div>
          </div>

          {/* Value display */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <AnimatedCounter
                value={value}
                prefix={prefix}
                suffix={suffix}
                className={cn('text-2xl md:text-3xl font-bold', variantStyles[variant])}
              />
            </div>

            {/* Trend indicator */}
            {trend && trendValue && (
              <motion.div 
                className={cn('flex items-center gap-1.5 text-xs font-semibold', trendColors[trend])}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.3 }}
              >
                {trendIcons[trend]}
                <span>{trendValue}</span>
              </motion.div>
            )}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
