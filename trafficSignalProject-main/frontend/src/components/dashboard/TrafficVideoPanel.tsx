import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import { Play, Pause, Maximize2, Eye, Target, Thermometer } from 'lucide-react';
import { generateVehicles, Vehicle } from '@/data/mockData';
import HeatmapOverlay from './HeatmapOverlay';

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  confidence: number;
  isViolation: boolean;
}

export default function TrafficVideoPanel({
  heatmapEnabled,
  onVehicleClick
}: {
  heatmapEnabled?: boolean;
  onVehicleClick?: (id: string) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [trajectories, setTrajectories] = useState<{ id: string; points: { x: number; y: number }[] }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate bounding box updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) return;

      const newBoxes: BoundingBox[] = Array.from({ length: 8 }, (_, i) => ({
        id: `VH-${String(i + 1).padStart(4, '0')}`,
        x: 10 + Math.random() * 70,
        y: 20 + Math.random() * 60,
        width: 8 + Math.random() * 6,
        height: 5 + Math.random() * 4,
        type: ['Car', 'Truck', 'Bike', 'Auto'][Math.floor(Math.random() * 4)],
        confidence: 85 + Math.random() * 14,
        isViolation: Math.random() > 0.85,
      }));

      setBoxes(newBoxes);

      // Update trajectories
      setTrajectories(newBoxes.slice(0, 4).map((box, i) => ({
        id: box.id,
        points: Array.from({ length: 5 }, (_, j) => ({
          x: box.x + (j * 3) + Math.random() * 2,
          y: box.y + (j * 2) * (i % 2 === 0 ? 1 : -1) + Math.random() * 2,
        })),
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Draw simulated video feed
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      // Dark road background
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road markings
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.4);
      ctx.lineTo(canvas.width, canvas.height * 0.4);
      ctx.moveTo(0, canvas.height * 0.6);
      ctx.lineTo(canvas.width, canvas.height * 0.6);
      ctx.stroke();

      // Vertical lane markers
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.25, 0);
      ctx.lineTo(canvas.width * 0.25, canvas.height);
      ctx.moveTo(canvas.width * 0.5, 0);
      ctx.lineTo(canvas.width * 0.5, canvas.height);
      ctx.moveTo(canvas.width * 0.75, 0);
      ctx.lineTo(canvas.width * 0.75, canvas.height);
      ctx.strokeStyle = '#ffffff20';
      ctx.stroke();

      // Add noise/grain effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);
    };

    drawFrame();
    const interval = setInterval(drawFrame, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassPanel className="h-full flex flex-col" hover={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="status-live">
            <span className="text-sm font-semibold text-foreground">LIVE FEED</span>
          </div>
          <span className="text-xs text-muted-foreground">Junction A-12 North</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            {isPlaying ? <Pause size={16} className="text-primary" /> : <Play size={16} className="text-primary" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <Maximize2 size={16} className="text-primary" />
          </motion.button>
        </div>
      </div>

      {/* Video container */}
      <div className="relative flex-1 rounded-lg overflow-hidden bg-background/50 min-h-[300px]">
        {/* Simulated video canvas */}
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Heatmap Overlay */}
        <HeatmapOverlay visible={!!heatmapEnabled} />

        {/* Mock Clickable Zones */}
        <div className="absolute inset-0 z-10">
          {[
            { x: '20%', y: '40%' },
            { x: '60%', y: '70%' },
            { x: '45%', y: '30%' }
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-24 h-16 border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all rounded-lg"
              style={{ left: pos.x, top: pos.y }}
              onClick={() => onVehicleClick?.(`VH-${String(8392 + i)}`)}
              title="Click for vehicle details"
            />
          ))}
        </div>

        {/* Bounding boxes overlay */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {boxes.map((box) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
                className={`absolute border-2 rounded ${box.isViolation
                    ? 'border-destructive violation-pulse'
                    : 'border-primary'
                  }`}
              >
                {/* ID Label */}
                <div
                  className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-xs font-mono ${box.isViolation
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-primary text-primary-foreground'
                    }`}
                >
                  {box.id}
                </div>

                {/* Confidence indicator */}
                <div className="absolute -bottom-5 left-0 text-[10px] text-muted-foreground font-mono">
                  {box.type} • {box.confidence.toFixed(0)}%
                </div>

                {/* Corner markers */}
                <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-current" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t-2 border-r-2 border-current" />
                <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b-2 border-l-2 border-current" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-current" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Trajectory lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {trajectories.map((traj) => (
              <motion.path
                key={traj.id}
                d={`M ${traj.points.map(p => `${p.x}% ${p.y}%`).join(' L ')}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </svg>
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <div className="px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-xs font-mono flex items-center gap-1">
            <Eye size={12} className="text-primary" />
            <span>{boxes.length} detected</span>
          </div>
          <div className="px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-xs font-mono flex items-center gap-1">
            <Target size={12} className="text-success" />
            <span>98.2% accuracy</span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-xs font-mono text-muted-foreground">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </GlassPanel>
  );
}
