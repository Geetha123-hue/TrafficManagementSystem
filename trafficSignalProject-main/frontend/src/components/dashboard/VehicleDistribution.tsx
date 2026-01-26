import { motion } from 'framer-motion';
import { vehicleDistribution } from '@/data/mockData';
import GlassPanel from '../ui/GlassPanel';
import { PieChart } from 'lucide-react';

export default function VehicleDistribution() {
  const total = vehicleDistribution.reduce((sum, v) => sum + v.count, 0);
  
  // Calculate angles for donut chart
  let currentAngle = 0;
  const segments = vehicleDistribution.map((v) => {
    const angle = (v.count / total) * 360;
    const segment = {
      ...v,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      percentage: ((v.count / total) * 100).toFixed(1),
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <GlassPanel className="h-full" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <PieChart className="text-primary" size={20} />
          Vehicle Types
        </h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {segments.map((segment, i) => {
              const radius = 35;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = `${(segment.endAngle - segment.startAngle) / 360 * circumference} ${circumference}`;
              const strokeDashoffset = -(segment.startAngle / 360 * circumference);
              
              return (
                <motion.circle
                  key={segment.type}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="15"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="drop-shadow-lg"
                  style={{
                    filter: `drop-shadow(0 0 6px ${segment.color})`,
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold font-mono">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {segments.map((segment, i) => (
            <motion.div
              key={segment.type}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between text-sm group hover:bg-muted/30 rounded-lg px-2 py-1 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {segment.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">{segment.count}</span>
                <span className="text-xs text-muted-foreground">({segment.percentage}%)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
