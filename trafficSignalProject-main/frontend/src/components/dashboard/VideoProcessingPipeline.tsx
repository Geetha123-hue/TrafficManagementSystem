import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';

export interface DetectionResult {
  frameNumber: number;
  timestamp: number;
  detections: {
    id: string;
    class: string;
    confidence: number;
    bbox: [number, number, number, number];
  }[];
}

export interface TrackingResult {
  frameNumber: number;
  timestamp: number;
  tracks: {
    trackId: string;
    class: string;
    bbox: [number, number, number, number];
    trajectory: Array<[number, number]>;
    velocity: [number, number];
  }[];
}

interface VideoProcessingPipelineProps {
  videoFile?: File;
  onAnalysisComplete?: (results: AnalysisResults) => void;
}

export interface AnalysisResults {
  videoId: string;
  fileName: string;
  duration: number;
  totalFrames: number;
  fps: number;
  detectionResults: DetectionResult[];
  trackingResults: TrackingResult[];
  queueMetrics: QueueMetrics[];
  violations: ViolationData[];
}

export interface QueueMetrics {
  frameNumber: number;
  timestamp: number;
  queueLength: number;
  queueDensity: number;
  avgVehicleSpeed: number;
}

export interface ViolationData {
  frameNumber: number;
  timestamp: number;
  type: 'red-light-jump' | 'rash-driving' | 'lane-violation';
  vehicleId: string;
  confidence: number;
  description: string;
}

export default function VideoProcessingPipeline({ videoFile, onAnalysisComplete }: VideoProcessingPipelineProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoMetadata, setVideoMetadata] = useState<{
    duration: number;
    fps: number;
    width: number;
    height: number;
  } | null>(null);
  const [processingStage, setProcessingStage] = useState<
    'idle' | 'loading' | 'detection' | 'tracking' | 'queue-analysis' | 'violation-detection' | 'completed'
  >('idle');
  
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [showVisualization, setShowVisualization] = useState(true);

  // Load video metadata
  useEffect(() => {
    if (!videoFile) return;

    const url = URL.createObjectURL(videoFile);
    const video = document.createElement('video');
    
    video.onloadedmetadata = () => {
      const fps = 30; // Default assumption, can be enhanced
      const totalFrames = Math.floor((video.duration * fps));
      
      setVideoMetadata({
        duration: video.duration,
        fps: fps,
        width: video.videoWidth,
        height: video.videoHeight,
      });
      setTotalFrames(totalFrames);
      
      if (videoRef.current) {
        videoRef.current.src = url;
      }
    };
    
    video.src = url;
  }, [videoFile]);

  // Simulate video processing pipeline
  const processVideo = async () => {
    if (!videoFile || !videoMetadata) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Stage 1: Vehicle Detection
      setProcessingStage('detection');
      await simulateDetection();
      setProgress(25);

      // Stage 2: Multi-Object Tracking
      setProcessingStage('tracking');
      await simulateTracking();
      setProgress(50);

      // Stage 3: Queue Analysis
      setProcessingStage('queue-analysis');
      await simulateQueueAnalysis();
      setProgress(75);

      // Stage 4: Violation Detection
      setProcessingStage('violation-detection');
      await simulateViolationDetection();
      setProgress(100);

      // Compile results
      const results: AnalysisResults = {
        videoId: Date.now().toString(),
        fileName: videoFile.name,
        duration: videoMetadata.duration,
        totalFrames: totalFrames,
        fps: videoMetadata.fps,
        detectionResults: generateMockDetections(),
        trackingResults: generateMockTracks(),
        queueMetrics: generateMockQueueMetrics(),
        violations: generateMockViolations(),
      };

      setAnalysisResults(results);
      setProcessingStage('completed');
      onAnalysisComplete?.(results);
    } catch (error) {
      console.error('Error processing video:', error);
      setProcessingStage('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateDetection = () =>
    new Promise(resolve => setTimeout(resolve, 2000));
  const simulateTracking = () =>
    new Promise(resolve => setTimeout(resolve, 2000));
  const simulateQueueAnalysis = () =>
    new Promise(resolve => setTimeout(resolve, 1500));
  const simulateViolationDetection = () =>
    new Promise(resolve => setTimeout(resolve, 1500));

  const generateMockDetections = (): DetectionResult[] => {
    const detections: DetectionResult[] = [];
    const classes = ['car', 'bike', 'bus', 'auto', 'truck'];
    
    for (let i = 0; i < Math.min(100, totalFrames); i += 10) {
      detections.push({
        frameNumber: i,
        timestamp: (i / videoMetadata!.fps),
        detections: Array.from({ length: Math.floor(Math.random() * 10) + 3 }).map(() => ({
          id: `det_${Math.random().toString(36).substr(2, 9)}`,
          class: classes[Math.floor(Math.random() * classes.length)],
          confidence: 0.8 + Math.random() * 0.2,
          bbox: [
            Math.random() * 100,
            Math.random() * 100,
            50 + Math.random() * 100,
            50 + Math.random() * 100,
          ] as [number, number, number, number],
        })),
      });
    }
    return detections;
  };

  const generateMockTracks = (): TrackingResult[] => {
    const tracks: TrackingResult[] = [];
    
    for (let i = 0; i < Math.min(100, totalFrames); i += 10) {
      tracks.push({
        frameNumber: i,
        timestamp: (i / videoMetadata!.fps),
        tracks: Array.from({ length: Math.floor(Math.random() * 8) + 2 }).map((_, idx) => ({
          trackId: `track_${idx}`,
          class: ['car', 'bike', 'bus'][Math.floor(Math.random() * 3)],
          bbox: [
            50 + Math.random() * 100,
            50 + Math.random() * 100,
            60 + Math.random() * 80,
            60 + Math.random() * 80,
          ] as [number, number, number, number],
          trajectory: Array.from({ length: 5 }).map(() => [
            Math.random() * 200,
            Math.random() * 200,
          ]),
          velocity: [
            -5 + Math.random() * 10,
            -5 + Math.random() * 10,
          ] as [number, number],
        })),
      });
    }
    return tracks;
  };

  const generateMockQueueMetrics = (): QueueMetrics[] => {
    const metrics: QueueMetrics[] = [];
    
    for (let i = 0; i < Math.min(100, totalFrames); i += 10) {
      metrics.push({
        frameNumber: i,
        timestamp: (i / videoMetadata!.fps),
        queueLength: Math.floor(5 + Math.random() * 20),
        queueDensity: 0.4 + Math.random() * 0.4,
        avgVehicleSpeed: 5 + Math.random() * 25,
      });
    }
    return metrics;
  };

  const generateMockViolations = (): ViolationData[] => {
    const violations: ViolationData[] = [];
    const types: Array<'red-light-jump' | 'rash-driving' | 'lane-violation'> = [
      'red-light-jump',
      'rash-driving',
      'lane-violation',
    ];

    for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
      violations.push({
        frameNumber: Math.floor(Math.random() * totalFrames),
        timestamp: Math.random() * videoMetadata!.duration,
        type: types[Math.floor(Math.random() * types.length)],
        vehicleId: `vehicle_${Math.floor(Math.random() * 100)}`,
        confidence: 0.75 + Math.random() * 0.25,
        description: `${['Red-light jump detected', 'Rash driving detected', 'Lane violation detected'][Math.floor(Math.random() * 3)]} with high confidence`,
      });
    }
    return violations;
  };

  const getStageLabel = () => {
    const labels: Record<typeof processingStage, string> = {
      'idle': 'Ready to Process',
      'loading': 'Loading Video...',
      'detection': 'Vehicle Detection...',
      'tracking': 'Multi-Object Tracking...',
      'queue-analysis': 'Queue Analysis...',
      'violation-detection': 'Violation Detection...',
      'completed': 'Analysis Complete',
    };
    return labels[processingStage];
  };

  return (
    <div className="space-y-6">
      {/* Video Preview */}
      <GlassPanel>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Video Processing Pipeline</h3>
          
          {videoFile && videoMetadata ? (
            <>
              {/* Video Display */}
              <div className="relative w-full bg-background rounded-lg overflow-hidden border border-border">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  controls={!isProcessing}
                />
                
                {/* Processing Overlay */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
                      />
                      <div className="text-center">
                        <p className="text-white font-semibold">{getStageLabel()}</p>
                        <p className="text-white/70 text-sm mt-1">{progress}%</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Video Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-semibold text-foreground">
                    {Math.floor(videoMetadata.duration)}s
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Resolution</p>
                  <p className="font-semibold text-foreground">
                    {videoMetadata.width}x{videoMetadata.height}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">FPS</p>
                  <p className="font-semibold text-foreground">{videoMetadata.fps}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Frames</p>
                  <p className="font-semibold text-foreground">{totalFrames}</p>
                </div>
              </div>

              {/* Processing Pipeline Stages */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Processing Pipeline</p>
                <div className="space-y-2">
                  {[
                    { stage: 'detection', label: 'Vehicle Detection' },
                    { stage: 'tracking', label: 'Multi-Object Tracking' },
                    { stage: 'queue-analysis', label: 'Queue Analysis' },
                    { stage: 'violation-detection', label: 'Violation Detection' },
                  ].map(({ stage, label }) => {
                    const isActive =
                      processingStage === stage ||
                      (processingStage === 'completed' && stage);
                    const isCompleted =
                      processingStage === 'completed' ||
                      (processingStage === 'tracking' && stage !== 'queue-analysis' && stage !== 'violation-detection') ||
                      (processingStage === 'queue-analysis' && stage !== 'violation-detection');

                    return (
                      <div key={stage} className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : isActive ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-border" />
                        )}
                        <span className="text-sm text-foreground">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  onClick={processVideo}
                  disabled={isProcessing}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isProcessing ? 'Processing...' : 'Start Analysis'}
                </Button>
                {analysisResults && (
                  <Button variant="outline" className="flex-1">
                    <Download size={16} className="mr-2" />
                    Download Report
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="text-muted-foreground mx-auto mb-3" size={32} />
              <p className="text-muted-foreground">Upload a video file to begin analysis</p>
            </div>
          )}
        </div>
      </GlassPanel>

      {/* Analysis Results Summary */}
      {analysisResults && (
        <GlassPanel>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Analysis Summary</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold text-foreground">
                  {analysisResults.detectionResults.reduce((sum, r) => sum + r.detections.length, 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground">Active Tracks</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(analysisResults.trackingResults.flatMap(r => r.tracks.map(t => t.trackId))).size}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground">Avg Queue Length</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(analysisResults.queueMetrics.reduce((sum, m) => sum + m.queueLength, 0) / analysisResults.queueMetrics.length)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground">Violations Found</p>
                <p className="text-2xl font-bold text-red-500">
                  {analysisResults.violations.length}
                </p>
              </div>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Canvas for visualization (hidden) */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
