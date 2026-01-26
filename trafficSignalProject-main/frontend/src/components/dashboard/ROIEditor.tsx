import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';

export interface ROIData {
  queueRegion: Array<[number, number]>;
  stopLine: Array<[number, number]>;
  signalPosition?: [number, number];
}

interface ROIEditorProps {
  videoWidth?: number;
  videoHeight?: number;
  onROISet?: (roiData: ROIData) => void;
}

type DrawingMode = 'queue' | 'stopline' | null;

export default function ROIEditor({
  videoWidth = 1280,
  videoHeight = 720,
  onROISet,
}: ROIEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(null);
  const [queueRegion, setQueueRegion] = useState<Array<[number, number]>>([]);
  const [stopLine, setStopLine] = useState<Array<[number, number]>>([]);
  const [signalPosition, setSignalPosition] = useState<[number, number] | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw Queue Region
    if (queueRegion.length > 0) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();

      ctx.moveTo(queueRegion[0][0], queueRegion[0][1]);
      for (let i = 1; i < queueRegion.length; i++) {
        ctx.lineTo(queueRegion[i][0], queueRegion[i][1]);
      }

      if (queueRegion.length > 2) {
        ctx.closePath();
        ctx.fill();
      }
      ctx.stroke();

      // Points
      queueRegion.forEach((point, idx) => {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(point[0], point[1], 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(idx + 1), point[0], point[1]);
      });

      // Label
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Queue Region', 10, 30);
    }

    // Draw Stop Line
    if (stopLine.length > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);

      ctx.beginPath();
      ctx.moveTo(stopLine[0][0], stopLine[0][1]);
      for (let i = 1; i < stopLine.length; i++) {
        ctx.lineTo(stopLine[i][0], stopLine[i][1]);
      }
      ctx.stroke();

      ctx.setLineDash([]);

      // Points
      stopLine.forEach((point, idx) => {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(point[0], point[1], 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(idx + 1), point[0], point[1]);
      });

      // Label
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Stop Line', 10, 55);
    }

    // Draw Signal Position
    if (signalPosition) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(signalPosition[0], signalPosition[1], 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(signalPosition[0], signalPosition[1], 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Signal', 10, 80);
    }

    // Instructions
    if (showInfo) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      const instructions = [
        `Mode: ${drawingMode ? drawingMode.replace('-', ' ').toUpperCase() : 'SELECT MODE'}`,
        'Click to add points • Double-click or press Enter to finish',
        `Queue Region: ${queueRegion.length} points | Stop Line: ${stopLine.length} points`,
      ];

      instructions.forEach((text, idx) => {
        ctx.fillText(text, 10, canvas.height - 30 + idx * 20);
      });
    }
  }, [queueRegion, stopLine, signalPosition, showGrid, showInfo, drawingMode]);

  // Handle canvas clicks
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !drawingMode) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);

    if (drawingMode === 'queue') {
      setQueueRegion([...queueRegion, [x, y]]);
    } else if (drawingMode === 'stopline') {
      setStopLine([...stopLine, [x, y]]);
    }
  };

  // Handle double click to finish drawing
  const handleCanvasDoubleClick = () => {
    finishDrawing();
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        finishDrawing();
      } else if (e.key === 'Escape') {
        setDrawingMode(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawingMode, queueRegion, stopLine]);

  const finishDrawing = () => {
    if (drawingMode && ((drawingMode === 'queue' && queueRegion.length > 2) ||
        (drawingMode === 'stopline' && stopLine.length > 1))) {
      setDrawingMode(null);
    }
  };

  const resetAll = () => {
    setQueueRegion([]);
    setStopLine([]);
    setSignalPosition(null);
    setDrawingMode(null);
  };

  const handleSaveROI = () => {
    const roiData: ROIData = {
      queueRegion,
      stopLine,
      signalPosition: signalPosition || undefined,
    };
    onROISet?.(roiData);
  };

  const isValid = queueRegion.length > 2 && stopLine.length > 1;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <GlassPanel className="border-blue-500/30 bg-blue-500/5">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-blue-600">ROI Definition Guide</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>Queue Region:</strong> Polygon area before the traffic signal stop line</li>
            <li>• <strong>Stop Line:</strong> Line marking the signal stop position</li>
            <li>• <strong>Signal Position:</strong> Optional reference for signal location</li>
            <li>• Click to add points, double-click or press Enter to finish drawing</li>
          </ul>
        </div>
      </GlassPanel>

      {/* Canvas */}
      <GlassPanel>
        <div className="space-y-4">
          <canvas
            ref={canvasRef}
            width={videoWidth}
            height={videoHeight}
            onClick={handleCanvasClick}
            onDoubleClick={handleCanvasDoubleClick}
            className="w-full h-auto bg-background/50 rounded-lg cursor-crosshair border border-border"
          />

          {/* Toggle Info */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? 'Hide' : 'Show'} Info
          </Button>
        </div>
      </GlassPanel>

      {/* ROI Drawing Tools */}
      <GlassPanel>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">ROI Drawing Tools</h3>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDrawingMode(drawingMode === 'queue' ? null : 'queue')}
              className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                drawingMode === 'queue'
                  ? 'border-blue-500 bg-blue-500/20 text-blue-600'
                  : 'border-border text-foreground hover:border-blue-500/50'
              }`}
            >
              {drawingMode === 'queue' ? '✓ Queue Region' : 'Queue Region'}
              <p className="text-xs text-muted-foreground mt-1">
                Points: {queueRegion.length}
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDrawingMode(drawingMode === 'stopline' ? null : 'stopline')}
              className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                drawingMode === 'stopline'
                  ? 'border-red-500 bg-red-500/20 text-red-600'
                  : 'border-border text-foreground hover:border-red-500/50'
              }`}
            >
              {drawingMode === 'stopline' ? '✓ Stop Line' : 'Stop Line'}
              <p className="text-xs text-muted-foreground mt-1">
                Points: {stopLine.length}
              </p>
            </motion.button>
          </div>

          {/* Options */}
          <div className="space-y-2 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={e => setShowGrid(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Grid</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1"
              onClick={resetAll}
            >
              <RotateCcw size={16} className="mr-2" />
              Reset All
            </Button>

            <Button
              onClick={handleSaveROI}
              disabled={!isValid}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Check size={16} className="mr-2" />
              Save ROI
            </Button>
          </div>
        </div>
      </GlassPanel>

      {/* ROI Summary */}
      {isValid && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel className="border-green-500/30 bg-green-500/5">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                <Check size={20} />
                ROI Configuration Valid
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-background/50 border border-blue-500/30">
                  <p className="text-xs text-muted-foreground">Queue Region</p>
                  <p className="text-lg font-bold text-blue-500 mt-1">
                    {queueRegion.length}
                  </p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>

                <div className="p-3 rounded-lg bg-background/50 border border-red-500/30">
                  <p className="text-xs text-muted-foreground">Stop Line</p>
                  <p className="text-lg font-bold text-red-500 mt-1">
                    {stopLine.length}
                  </p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>

                <div className="p-3 rounded-lg bg-background/50 border border-yellow-500/30">
                  <p className="text-xs text-muted-foreground">Signal</p>
                  <p className="text-lg font-bold text-yellow-500 mt-1">
                    {signalPosition ? 'Set' : 'Optional'}
                  </p>
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </div>
  );
}
