import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import { generateViolations, Violation } from '@/data/mockData';
import { AlertTriangle, Camera, Clock, Hash, ChevronRight, Shield } from 'lucide-react';

const violationLabels: Record<Violation['type'], string> = {
  red_light: 'Red Light Violation',
  wrong_lane: 'Wrong Lane Driving',
  overspeeding: 'Over Speeding',
  rash_driving: 'Rash Driving',
  no_helmet: 'No Helmet',
};

const violationIcons: Record<Violation['type'], string> = {
  red_light: '🚦',
  wrong_lane: '↔️',
  overspeeding: '⚡',
  rash_driving: '⚠️',
  no_helmet: '🪖',
};

export default function ViolationCards() {
  const [violations, setViolations] = useState<Violation[]>(generateViolations());
  const [newViolation, setNewViolation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setViolations(generateViolations());
      setNewViolation(true);
      setTimeout(() => setNewViolation(false), 1000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: Violation['severity']) => {
    switch (severity) {
      case 'high': return 'border-destructive bg-destructive/5';
      case 'medium': return 'border-warning bg-warning/5';
      case 'low': return 'border-success bg-success/5';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <GlassPanel className="h-full flex flex-col" hover={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="text-destructive" size={20} />
          Violation Detection
        </h3>
        <motion.div 
          className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 ${
            newViolation ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'
          }`}
          animate={newViolation ? { scale: [1, 1.1, 1] } : {}}
        >
          <Shield size={12} />
          {violations.length} TODAY
        </motion.div>
      </div>

      {/* Alert flash overlay */}
      <AnimatePresence>
        {newViolation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: 'radial-gradient(circle at center, hsl(var(--destructive) / 0.1) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Violations list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence mode="popLayout">
          {violations.map((violation, i) => (
            <motion.div
              key={violation.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`p-3 rounded-lg border ${getSeverityColor(violation.severity)} cursor-pointer group`}
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    {violationIcons[violation.type]}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-1">
                    <Camera size={10} className="text-primary" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm truncate">
                      {violationLabels[violation.type]}
                    </h4>
                    <ChevronRight 
                      size={16} 
                      className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" 
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Hash size={10} />
                    <span className="font-mono">{violation.vehicleId}</span>
                    <span>•</span>
                    <Clock size={10} />
                    <span>{formatTime(violation.timestamp)}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {/* Confidence meter */}
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-[10px] text-muted-foreground">CONF</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${violation.confidence}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-primary">{violation.confidence}%</span>
                    </div>

                    {/* Severity badge */}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      violation.severity === 'high' ? 'bg-destructive/20 text-destructive' :
                      violation.severity === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-success/20 text-success'
                    }`}>
                      {violation.severity}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}
