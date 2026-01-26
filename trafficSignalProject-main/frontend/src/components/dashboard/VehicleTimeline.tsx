import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import { Play, Pause, SkipBack, SkipForward, Clock, Car, Route } from 'lucide-react';

interface TimelineEvent {
  id: string;
  vehicleId: string;
  type: 'entry' | 'exit' | 'violation' | 'lane_change' | 'stop';
  timestamp: number; // 0-100 representing timeline position
  position: { x: number; y: number };
  description: string;
  color: string;
}

const generateTimelineEvents = (): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const vehicleIds = ['VH-0012', 'VH-0045', 'VH-0078', 'VH-0023', 'VH-0091'];
  const colors = ['#00f0ff', '#ff3366', '#00ff88', '#ffaa00', '#aa66ff'];
  
  vehicleIds.forEach((vehicleId, vi) => {
    const numEvents = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < numEvents; i++) {
      const types: TimelineEvent['type'][] = ['entry', 'lane_change', 'stop', 'violation', 'exit'];
      const type = i === 0 ? 'entry' : i === numEvents - 1 ? 'exit' : types[Math.floor(Math.random() * 3) + 1];
      
      events.push({
        id: `${vehicleId}-${i}`,
        vehicleId,
        type,
        timestamp: Math.min(95, Math.max(5, (i / numEvents) * 100 + (Math.random() * 10 - 5))),
        position: { 
          x: 10 + (i / numEvents) * 80 + (Math.random() * 10 - 5),
          y: 20 + vi * 15 + (Math.random() * 5 - 2.5)
        },
        description: getEventDescription(type, vehicleId),
        color: colors[vi],
      });
    }
  });
  
  return events.sort((a, b) => a.timestamp - b.timestamp);
};

const getEventDescription = (type: TimelineEvent['type'], vehicleId: string): string => {
  switch (type) {
    case 'entry': return `${vehicleId} entered intersection`;
    case 'exit': return `${vehicleId} exited intersection`;
    case 'violation': return `${vehicleId} - Speed violation detected`;
    case 'lane_change': return `${vehicleId} changed lane`;
    case 'stop': return `${vehicleId} stopped at signal`;
    default: return `${vehicleId} event`;
  }
};

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'violation': return '⚠️';
    case 'lane_change': return '↔️';
    case 'stop': return '🛑';
    case 'entry': return '➡️';
    case 'exit': return '⬅️';
    default: return '•';
  }
};

export default function VehicleTimeline() {
  const [events] = useState<TimelineEvent[]>(generateTimelineEvents());
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get unique vehicles
  const vehicles = [...new Set(events.map(e => e.vehicleId))];
  const vehicleColors = vehicles.reduce((acc, v, i) => {
    const colors = ['#00f0ff', '#ff3366', '#00ff88', '#ffaa00', '#aa66ff'];
    acc[v] = colors[i % colors.length];
    return acc;
  }, {} as Record<string, string>);

  // Playback control
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 50);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Get visible events based on current time
  const visibleEvents = events.filter(e => e.timestamp <= currentTime);
  const activeEvent = visibleEvents[visibleEvents.length - 1];

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setCurrentTime(Math.max(0, Math.min(100, percent)));
  };

  const skipBack = () => setCurrentTime(Math.max(0, currentTime - 10));
  const skipForward = () => setCurrentTime(Math.min(100, currentTime + 10));

  return (
    <GlassPanel className="h-full" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Route className="text-primary" size={20} />
          Vehicle Timeline
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={14} />
          <span className="font-mono">{currentTime.toFixed(0)}%</span>
        </div>
      </div>

      {/* Mini trajectory map */}
      <div className="relative h-28 mb-4 rounded-lg bg-muted/20 border border-border/50 overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {[...Array(10)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${i * 10}%`}
              y1="0"
              x2={`${i * 10}%`}
              y2="100%"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={`${i * 25}%`}
              x2="100%"
              y2={`${i * 25}%`}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Vehicle trails */}
        {vehicles.map(vehicleId => {
          const vehicleEvents = events
            .filter(e => e.vehicleId === vehicleId && e.timestamp <= currentTime)
            .sort((a, b) => a.timestamp - b.timestamp);
          
          if (vehicleEvents.length < 2) return null;
          
          const isHovered = hoveredVehicle === vehicleId;
          
          return (
            <svg 
              key={vehicleId} 
              className="absolute inset-0 w-full h-full"
              onMouseEnter={() => setHoveredVehicle(vehicleId)}
              onMouseLeave={() => setHoveredVehicle(null)}
            >
              <motion.path
                d={vehicleEvents.map((e, i) => 
                  `${i === 0 ? 'M' : 'L'} ${e.position.x}% ${e.position.y}%`
                ).join(' ')}
                fill="none"
                stroke={vehicleColors[vehicleId]}
                strokeWidth={isHovered ? 3 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isHovered ? 1 : 0.6 }}
                transition={{ duration: 0.5 }}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${vehicleColors[vehicleId]})` : 'none',
                }}
              />
              {/* Current position marker */}
              {vehicleEvents.length > 0 && (
                <motion.circle
                  cx={`${vehicleEvents[vehicleEvents.length - 1].position.x}%`}
                  cy={`${vehicleEvents[vehicleEvents.length - 1].position.y}%`}
                  r={isHovered ? 6 : 4}
                  fill={vehicleColors[vehicleId]}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${vehicleColors[vehicleId]})`,
                  }}
                />
              )}
            </svg>
          );
        })}

        {/* Event markers */}
        {visibleEvents.filter(e => e.type === 'violation').map(event => (
          <motion.div
            key={event.id}
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ 
              left: `${event.position.x}%`, 
              top: `${event.position.y}%` 
            }}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={() => setSelectedEvent(event)}
          >
            <div className="w-full h-full rounded-full bg-destructive/80 animate-pulse" />
          </motion.div>
        ))}
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={skipBack}
          className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <SkipBack size={16} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={skipForward}
          className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <SkipForward size={16} />
        </motion.button>
      </div>

      {/* Timeline scrubber */}
      <div 
        ref={timelineRef}
        className="relative h-12 rounded-lg bg-muted/20 cursor-pointer overflow-hidden group"
        onClick={handleTimelineClick}
      >
        {/* Progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/30 to-primary/10"
          style={{ width: `${currentTime}%` }}
        />
        
        {/* Event markers on timeline */}
        {events.map(event => (
          <motion.div
            key={event.id}
            className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full cursor-pointer transition-all ${
              event.timestamp <= currentTime ? 'opacity-100' : 'opacity-30'
            }`}
            style={{ 
              left: `${event.timestamp}%`,
              backgroundColor: event.type === 'violation' ? 'hsl(var(--destructive))' : vehicleColors[event.vehicleId],
            }}
            whileHover={{ scale: 2 }}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentTime(event.timestamp);
              setSelectedEvent(event);
            }}
          />
        ))}
        
        {/* Playhead */}
        <motion.div
          className="absolute top-0 w-0.5 h-full bg-primary"
          style={{ left: `${currentTime}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-lg" 
            style={{ boxShadow: '0 0 10px hsl(var(--primary))' }}
          />
        </motion.div>

        {/* Time labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-muted-foreground font-mono">
          <span>00:00</span>
          <span>05:00</span>
          <span>10:00</span>
        </div>
      </div>

      {/* Vehicle legend */}
      <div className="flex flex-wrap gap-2 mt-4">
        {vehicles.map(vehicleId => (
          <motion.div
            key={vehicleId}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs cursor-pointer transition-all ${
              hoveredVehicle === vehicleId ? 'bg-muted/50' : 'bg-muted/20'
            }`}
            onMouseEnter={() => setHoveredVehicle(vehicleId)}
            onMouseLeave={() => setHoveredVehicle(null)}
            whileHover={{ scale: 1.05 }}
          >
            <Car size={12} style={{ color: vehicleColors[vehicleId] }} />
            <span className="font-mono">{vehicleId}</span>
          </motion.div>
        ))}
      </div>

      {/* Selected event tooltip */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold flex items-center gap-2">
                <span>{getEventIcon(selectedEvent.type)}</span>
                {selectedEvent.vehicleId}
              </span>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{selectedEvent.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  );
}
