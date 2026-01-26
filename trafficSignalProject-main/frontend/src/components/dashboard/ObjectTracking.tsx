import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { TrackingResult } from './VideoProcessingPipeline';

interface ObjectTrackingProps {
  trackingResults: TrackingResult[];
  videoWidth?: number;
  videoHeight?: number;
}

interface TrackStats {
  trackId: string;
  class: string;
  frameCount: number;
  avgVelocity: number;
  totalDistance: number;
  startFrame: number;
  endFrame: number;
}

export default function ObjectTracking({
  trackingResults,
  videoWidth = 1280,
  videoHeight = 720,
}: ObjectTrackingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [trackStats, setTrackStats] = useState<TrackStats[]>([]);
  const [showTrajectories, setShowTrajectories] = useState(true);
  const [showVelocity, setShowVelocity] = useState(false);

  // Calculate track statistics
  useEffect(() => {
    const trackMap = new Map<string, TrackStats>();

    trackingResults.forEach((result, resultIndex) => {
      result.tracks.forEach(track => {
        const existing = trackMap.get(track.trackId) || {
          trackId: track.trackId,
          class: track.class,
          frameCount: 0,
          avgVelocity: 0,
          totalDistance: 0,
          startFrame: resultIndex,
          endFrame: resultIndex,
        };

        const velocity = Math.sqrt(
          track.velocity[0] ** 2 + track.velocity[1] ** 2
        );
        existing.frameCount++;
        existing.avgVelocity += velocity;
        existing.endFrame = resultIndex;

        // Calculate distance from trajectory
        if (track.trajectory.length > 1) {
          for (let i = 0; i < track.trajectory.length - 1; i++) {
            const dx =
              track.trajectory[i + 1][0] - track.trajectory[i][0];
            const dy =
              track.trajectory[i + 1][1] - track.trajectory[i][1];
            existing.totalDistance += Math.sqrt(dx ** 2 + dy ** 2);
          }
        }

        trackMap.set(track.trackId, existing);
      });
    });

    const stats = Array.from(trackMap.values())
      .map(stat => ({
        ...stat,
        avgVelocity: stat.frameCount > 0 ? stat.avgVelocity / stat.frameCount : 0,
      }))
      .sort((a, b) => b.frameCount - a.frameCount);

    setTrackStats(stats);
  }, [trackingResults]);

  // Draw trajectories on canvas
  useEffect(() => {
    if (!canvasRef.current || trackingResults.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = [
      '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
      '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
    ];

    let colorIndex = 0;
    const colorMap = new Map<string, string>();

    // Draw all trajectories
    trackingResults.forEach((result, resultIndex) => {
      result.tracks.forEach(track => {
        const color = colorMap.get(track.trackId) || colors[colorIndex % colors.length];
        if (!colorMap.has(track.trackId)) {
          colorMap.set(track.trackId, color);
          colorIndex++;
        }

        // Only draw if selected or show all
        if (!selectedTrack || selectedTrack === track.trackId) {
          // Draw trajectory
          if (showTrajectories && track.trajectory.length > 1) {
            ctx.strokeStyle = color;
            ctx.lineWidth = selectedTrack === track.trackId ? 3 : 2;
            ctx.globalAlpha = selectedTrack === track.trackId ? 1 : 0.6;
            ctx.beginPath();
            ctx.moveTo(track.trajectory[0][0], track.trajectory[0][1]);

            for (let i = 1; i < track.trajectory.length; i++) {
              ctx.lineTo(track.trajectory[i][0], track.trajectory[i][1]);
            }
            ctx.stroke();

            // Draw trajectory points
            track.trajectory.forEach((point, idx) => {
              ctx.fillStyle = color;
              ctx.globalAlpha = 0.5 + (idx / track.trajectory.length) * 0.5;
              ctx.beginPath();
              ctx.arc(point[0], point[1], 3, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          // Draw bounding box
          ctx.globalAlpha = selectedTrack === track.trackId ? 1 : 0.7;
          ctx.strokeStyle = color;
          ctx.lineWidth = selectedTrack === track.trackId ? 3 : 2;
          ctx.strokeRect(
            track.bbox[0],
            track.bbox[1],
            track.bbox[2],
            track.bbox[3]
          );

          // Draw track ID
          ctx.fillStyle = color;
          ctx.font = 'bold 12px Arial';
          ctx.fillText(
            `${track.trackId}`,
            track.bbox[0],
            track.bbox[1] - 5
          );

          // Draw velocity vector if enabled
          if (showVelocity && (track.velocity[0] !== 0 || track.velocity[1] !== 0)) {
            const scale = 10;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            const centerX = track.bbox[0] + track.bbox[2] / 2;
            const centerY = track.bbox[1] + track.bbox[3] / 2;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
              centerX + track.velocity[0] * scale,
              centerY + track.velocity[1] * scale
            );
            ctx.stroke();

            // Arrow head
            const angle = Math.atan2(
              track.velocity[1] * scale,
              track.velocity[0] * scale
            );
            const arrowSize = 5;
            ctx.beginPath();
            ctx.moveTo(
              centerX + track.velocity[0] * scale,
              centerY + track.velocity[1] * scale
            );
            ctx.lineTo(
              centerX +
                track.velocity[0] * scale -
                arrowSize * Math.cos(angle - Math.PI / 6),
              centerY +
                track.velocity[1] * scale -
                arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              centerX +
                track.velocity[0] * scale -
                arrowSize * Math.cos(angle + Math.PI / 6),
              centerY +
                track.velocity[1] * scale -
                arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.fill();
          }
        }
      });
    });

    ctx.globalAlpha = 1;
  }, [trackingResults, selectedTrack, showTrajectories, showVelocity]);

  const classEmojis: Record<string, string> = {
    car: '🚗',
    bike: '🏍️',
    bus: '🚌',
    auto: '🚕',
    truck: '🚚',
  };

  return (
    <div className="space-y-6">
      {/* Multi-Object Tracking Overview */}
      <GlassPanel>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Zap size={20} />
              Multi-Object Tracking (MOT)
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time trajectory tracking and velocity estimation
            </p>
          </div>

          {/* Canvas for trajectory visualization */}
          <div className="relative w-full bg-background rounded-lg overflow-hidden border border-border">
            <canvas
              ref={canvasRef}
              width={videoWidth}
              height={videoHeight}
              className="w-full h-auto bg-background/50"
            />

            {/* Legend */}
            <div className="absolute top-4 left-4 p-3 rounded-lg bg-background/80 backdrop-blur border border-border/50">
              <p className="text-xs font-semibold text-foreground mb-2">
                Legend
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>━ = Trajectory</p>
                <p>● = Trajectory Point</p>
                <p>⬜ = Bounding Box</p>
                <p>→ = Velocity Vector</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 flex-wrap">
            <Button
              variant={showTrajectories ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowTrajectories(!showTrajectories)}
            >
              {showTrajectories ? <Eye size={16} /> : <EyeOff size={16} />}
              Trajectories
            </Button>
            <Button
              variant={showVelocity ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowVelocity(!showVelocity)}
            >
              {showVelocity ? <Eye size={16} /> : <EyeOff size={16} />}
              Velocity Vectors
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Total Tracks</p>
              <p className="text-2xl font-bold text-foreground">{trackStats.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Frames</p>
              <p className="text-2xl font-bold text-foreground">{trackingResults.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Track Length</p>
              <p className="text-2xl font-bold text-foreground">
                {trackStats.length > 0
                  ? Math.round(
                      trackStats.reduce((sum, t) => sum + t.frameCount, 0) /
                        trackStats.length
                    )
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Track Statistics */}
      <GlassPanel>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Track Details</h3>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {trackStats.map((stat, index) => {
              const isSelected = selectedTrack === stat.trackId;

              return (
                <motion.button
                  key={stat.trackId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                  onClick={() =>
                    setSelectedTrack(isSelected ? null : stat.trackId)
                  }
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background/50 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-lg">
                        {classEmojis[stat.class] || '🚗'}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">
                          {stat.trackId}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {stat.class} • Frame {stat.startFrame} - {stat.endFrame}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {stat.frameCount} frames
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.avgVelocity.toFixed(2)} px/frame
                      </p>
                    </div>
                  </div>

                  {/* Progress bar showing track length */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.frameCount / trackingResults.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {((stat.frameCount / trackingResults.length) * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </GlassPanel>

      {/* Track Analysis */}
      {selectedTrack && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassPanel>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Track Analysis: {selectedTrack}
              </h3>

              {(() => {
                const stat = trackStats.find(s => s.trackId === selectedTrack);
                if (!stat) return null;

                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                      <p className="text-xs text-muted-foreground">Vehicle Class</p>
                      <p className="text-lg font-semibold text-foreground capitalize mt-1">
                        {stat.class}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                      <p className="text-xs text-muted-foreground">Frame Count</p>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {stat.frameCount}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                      <p className="text-xs text-muted-foreground">Avg Velocity</p>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {stat.avgVelocity.toFixed(2)} px/frame
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                      <p className="text-xs text-muted-foreground">Total Distance</p>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {stat.totalDistance.toFixed(0)} px
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </div>
  );
}
