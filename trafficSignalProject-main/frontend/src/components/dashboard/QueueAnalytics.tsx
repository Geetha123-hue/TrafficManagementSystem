import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import { generateQueueData, QueueData } from '@/data/mockData';
import { Layers, Clock, TrendingUp } from 'lucide-react';

export default function QueueAnalytics() {
  const [queueData, setQueueData] = useState<QueueData[]>(generateQueueData());
  const [selectedLane, setSelectedLane] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueData(generateQueueData());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (density: number) => {
    if (density < 0.3) return 'bg-success';
    if (density < 0.6) return 'bg-warning';
    return 'bg-destructive';
  };

  const getDensityGradient = (density: number) => {
    if (density < 0.3) return 'from-success/20 to-success/5';
    if (density < 0.6) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  return (
    <GlassPanel className="h-full" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Layers className="text-primary" size={20} />
          Queue Analysis
        </h3>
        <div className="px-2 py-1 rounded-full bg-primary/10 text-xs text-primary font-mono">
          REAL-TIME
        </div>
      </div>

      {/* 3D Lane Visualization */}
      <div className="relative h-48 mb-6 perspective-1000">
        <div 
          className="absolute inset-0 flex justify-center items-end gap-2"
          style={{ transform: 'rotateX(20deg) rotateY(-10deg)', transformStyle: 'preserve-3d' }}
        >
          {queueData.map((lane, i) => (
            <motion.div
              key={lane.lane}
              className="relative cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              whileHover={{ scale: 1.05, z: 20 }}
              onClick={() => setSelectedLane(selectedLane === lane.lane ? null : lane.lane)}
            >
              {/* Lane base */}
              <div 
                className="w-16 rounded-t-lg bg-muted/30 relative"
                style={{ 
                  height: `${lane.length * 8}px`,
                  minHeight: '40px',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Stacked vehicles */}
                {Array.from({ length: Math.min(lane.vehicleCount, 8) }, (_, vi) => (
                  <motion.div
                    key={vi}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: vi * 0.05 }}
                    className={`absolute left-1 right-1 h-4 rounded ${getDensityColor(lane.density)} opacity-70`}
                    style={{ bottom: `${vi * 18 + 4}px` }}
                  />
                ))}
                
                {/* Lane number */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground">
                  L{lane.lane}
                </div>

                {/* Density gradient overlay */}
                <div 
                  className={`absolute inset-0 rounded-t-lg bg-gradient-to-t ${getDensityGradient(lane.density)}`}
                />
              </div>

              {/* Glow effect */}
              <div 
                className={`absolute -inset-1 rounded-t-lg blur-md ${getDensityColor(lane.density)} opacity-20`}
                style={{ height: `${lane.length * 8 + 8}px`, minHeight: '48px' }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lane Details */}
      <div className="space-y-3">
        {queueData.map((lane, i) => (
          <motion.div
            key={lane.lane}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-3 rounded-lg bg-muted/20 border border-border/50 transition-all ${
              selectedLane === lane.lane ? 'ring-1 ring-primary' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Lane {lane.lane}</span>
              <div className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                lane.congestionScore > 70 ? 'bg-destructive/20 text-destructive' :
                lane.congestionScore > 40 ? 'bg-warning/20 text-warning' :
                'bg-success/20 text-success'
              }`}>
                {lane.congestionScore}% congested
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Layers size={12} className="text-muted-foreground" />
                <span className="text-muted-foreground">{lane.vehicleCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-muted-foreground" />
                <span className="text-muted-foreground">{lane.avgWaitTime}s</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className="text-muted-foreground" />
                <span className="text-muted-foreground">{(lane.density * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Density bar */}
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getDensityColor(lane.density)}`}
                initial={{ width: 0 }}
                animate={{ width: `${lane.density * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
