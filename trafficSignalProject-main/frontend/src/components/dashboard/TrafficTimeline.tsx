import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import { hourlyTraffic } from '@/data/mockData';
import { Activity, TrendingUp } from 'lucide-react';

export default function TrafficTimeline() {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  
  const maxVehicles = Math.max(...hourlyTraffic.map(h => h.vehicles));
  const currentHour = new Date().getHours();

  return (
    <GlassPanel className="h-full" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="text-primary" size={20} />
          24h Traffic Flow
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Vehicles</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Violations</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-40 flex items-end gap-1">
        {hourlyTraffic.map((data, i) => {
          const heightPercent = (data.vehicles / maxVehicles) * 100;
          const isCurrentHour = i === currentHour;
          const isHovered = hoveredHour === i;
          
          return (
            <motion.div
              key={data.hour}
              className="flex-1 relative cursor-pointer group"
              onMouseEnter={() => setHoveredHour(i)}
              onMouseLeave={() => setHoveredHour(null)}
            >
              {/* Vehicle bar */}
              <motion.div
                className={`w-full rounded-t-sm ${
                  isCurrentHour ? 'bg-primary' : 'bg-primary/40'
                } ${isHovered ? 'bg-primary' : ''}`}
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
                style={{
                  boxShadow: isCurrentHour || isHovered
                    ? '0 0 10px hsl(var(--primary) / 0.5)'
                    : 'none',
                }}
              />
              
              {/* Violation indicator */}
              {data.violations > 0 && (
                <motion.div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-destructive"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.02 + 0.3 }}
                />
              )}

              {/* Hover tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 px-3 py-2 rounded-lg bg-popover border border-border shadow-lg text-xs whitespace-nowrap"
                >
                  <div className="font-semibold">{data.hour}</div>
                  <div className="text-muted-foreground">{data.vehicles} vehicles</div>
                  <div className="text-destructive">{data.violations} violations</div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>

      {/* Peak time indicator */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp size={14} className="text-primary" />
          Peak Hour: 09:00 - 10:00
        </div>
        <div className="font-mono text-primary">
          {Math.max(...hourlyTraffic.map(h => h.vehicles))} vehicles
        </div>
      </div>
    </GlassPanel>
  );
}
