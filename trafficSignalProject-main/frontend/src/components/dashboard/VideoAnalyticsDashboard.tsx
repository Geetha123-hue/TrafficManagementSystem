import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BarChart3, AlertTriangle, Zap, MapPin, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import VideoUploadModule from './VideoUploadModule';
import VideoProcessingPipeline, { AnalysisResults } from './VideoProcessingPipeline';
import DetectionResults from './DetectionResults';
import ObjectTracking from './ObjectTracking';
import TrafficViolationDetection from './TrafficViolationDetection';
import ROIEditor, { ROIData } from './ROIEditor';
import { useVideo } from '@/contexts/VideoContext';
import { useEffect } from 'react';

type AnalysisTab = 'upload' | 'roi' | 'processing' | 'detection' | 'tracking' | 'violations';

interface TabConfig {
  id: AnalysisTab;
  label: string;
  icon: React.ComponentType<any> | (() => React.ReactNode);
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: 'upload',
    label: 'Upload Video',
    icon: () => <span className="text-xl">📹</span>,
    description: 'Select and upload surveillance video',
  },
  {
    id: 'roi',
    label: 'Define ROI',
    icon: () => <MapPin size={18} />,
    description: 'Set queue region and stop line',
  },
  {
    id: 'processing',
    label: 'Process Video',
    icon: () => <Zap size={18} />,
    description: 'Run AI analysis pipeline',
  },
  {
    id: 'detection',
    label: 'Detections',
    icon: () => <BarChart3 size={18} />,
    description: 'Vehicle detection results',
  },
  {
    id: 'tracking',
    label: 'Tracking',
    icon: () => <Zap size={18} />,
    description: 'Multi-object tracking',
  },
  {
    id: 'violations',
    label: 'Violations',
    icon: () => <AlertTriangle size={18} />,
    description: 'Traffic rule violations',
  },
];

export default function VideoAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('processing');
  const [uploadedFile, setUploadedFile] = useState<File | null>(new File(['demo'], 'demo-traffic.mp4', { type: 'video/mp4' }));
  const [isUploadValid, setIsUploadValid] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [roiData, setROIData] = useState<ROIData | null>({
    queueRegion: [[100, 200], [300, 200], [300, 400], [100, 400]],
    stopLine: [[100, 200], [300, 200]],
  });
  const [completedSteps, setCompletedSteps] = useState<Set<AnalysisTab>>(new Set(['upload', 'roi']));
  const { currentVideo, uploadedVideos, removeVideo } = useVideo();

  // Load demo analysis results on component mount
  useEffect(() => {
    const generateDemoResults = (): AnalysisResults => {
      const fps = 30;
      const duration = 30;
      const totalFrames = Math.floor(duration * fps);
      
      // Generate mock detections
      const detectionResults = Array.from({ length: Math.min(50, totalFrames) }).map((_, i) => {
        const frameNum = i * 10;
        return {
          frameNumber: frameNum,
          timestamp: frameNum / fps,
          detections: Array.from({ length: Math.floor(Math.random() * 8) + 3 }).map(() => ({
            id: `det_${Math.random().toString(36).substr(2, 9)}`,
            class: ['car', 'bike', 'bus', 'truck', 'auto'][Math.floor(Math.random() * 5)],
            confidence: 0.8 + Math.random() * 0.2,
            bbox: [
              Math.random() * 100,
              Math.random() * 100,
              50 + Math.random() * 100,
              50 + Math.random() * 100,
            ] as [number, number, number, number],
          })),
        };
      });

      // Generate mock tracking results
      const trackingResults = Array.from({ length: Math.min(50, totalFrames) }).map((_, i) => {
        const frameNum = i * 10;
        return {
          frameNumber: frameNum,
          timestamp: frameNum / fps,
          tracks: Array.from({ length: Math.floor(Math.random() * 6) + 2 }).map((_, idx) => ({
            trackId: `track_${idx}`,
            class: ['car', 'bike', 'bus'][Math.floor(Math.random() * 3)],
            bbox: [50 + Math.random() * 100, 50 + Math.random() * 100, 60 + Math.random() * 80, 60 + Math.random() * 80] as [number, number, number, number],
            trajectory: Array.from({ length: 5 }).map(() => [Math.random() * 200, Math.random() * 200]),
            velocity: [Math.random() * 10 - 5, Math.random() * 10 - 5] as [number, number],
          })),
        };
      });

      // Generate mock queue metrics
      const queueMetrics = Array.from({ length: Math.min(50, totalFrames) }).map((_, i) => {
        const frameNum = i * 10;
        return {
          frameNumber: frameNum,
          timestamp: frameNum / fps,
          queueLength: Math.floor(5 + Math.random() * 20),
          queueDensity: 0.4 + Math.random() * 0.4,
          avgVehicleSpeed: 5 + Math.random() * 25,
        };
      });

      // Generate mock violations
      const violations = Array.from({ length: Math.floor(Math.random() * 5) + 2 }).map((_, i) => ({
        frameNumber: Math.floor(Math.random() * totalFrames),
        timestamp: Math.random() * duration,
        type: ['red-light-jump' as const, 'rash-driving' as const, 'lane-violation' as const][Math.floor(Math.random() * 3)],
        vehicleId: `vehicle_${Math.floor(Math.random() * 100)}`,
        confidence: 0.75 + Math.random() * 0.25,
        description: [
          'Red-light jump detected with high confidence',
          'Rash driving detected with high confidence',
          'Lane violation detected with high confidence',
        ][Math.floor(Math.random() * 3)],
      }));

      return {
        videoId: Date.now().toString(),
        fileName: 'demo-traffic.mp4',
        duration,
        totalFrames,
        fps,
        detectionResults,
        trackingResults,
        queueMetrics,
        violations,
      };
    };

    // Auto-load demo data
    const demoResults = generateDemoResults();
    setAnalysisResults(demoResults);
    setCompletedSteps(prev => new Set([...prev, 'processing', 'detection', 'tracking', 'violations']));
  }, []);

  const handleVideoUploaded = (file: File) => {
    // Validate that file exists and is a valid video
    if (!file || !file.type.startsWith('video/')) {
      console.error('Invalid file uploaded');
      return;
    }
    
    setUploadedFile(file);
    setIsUploadValid(true);
    setCompletedSteps(prev => new Set([...prev, 'upload']));
    
    // Auto-navigate to ROI setup
    setTimeout(() => {
      setActiveTab('roi');
    }, 500);
  };

  // Sync with current video from context
  useEffect(() => {
    if (currentVideo && uploadedVideos.length > 0) {
      // Video has been uploaded and persisted
      setCompletedSteps(prev => new Set([...prev, 'upload']));
    }
  }, [currentVideo, uploadedVideos]);

  const handleROISet = (roi: ROIData) => {
    setROIData(roi);
    setCompletedSteps(prev => new Set([...prev, 'roi']));
    setActiveTab('processing');
  };

  const handleAnalysisComplete = (results: AnalysisResults) => {
    setAnalysisResults(results);
    setCompletedSteps(prev => new Set([...prev, 'processing', 'detection', 'tracking', 'violations']));
    // Auto-navigate to detection results to show output
    setTimeout(() => {
      setActiveTab('detection');
    }, 500);
  };

  const canAccessTab = (tabId: AnalysisTab): boolean => {
    const prerequisiteMap: Record<AnalysisTab, AnalysisTab[]> = {
      upload: [],
      roi: ['upload'],
      processing: ['roi'],
      detection: ['processing'],
      tracking: ['processing'],
      violations: ['processing'],
    };

    return prerequisiteMap[tabId].every(prereq => completedSteps.has(prereq));
  };

  const getTabStatus = (tabId: AnalysisTab): 'completed' | 'active' | 'locked' => {
    if (completedSteps.has(tabId)) return 'completed';
    if (activeTab === tabId) return 'active';
    return canAccessTab(tabId) ? 'active' : 'locked';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-40 bg-background/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Video Analytics Pipeline
              </h1>
              <p className="text-muted-foreground mt-1">
                AI-powered traffic analysis from surveillance footage
              </p>
            </div>
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Previously Uploaded Videos */}
        {uploadedVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassPanel className="border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Previously Uploaded Videos ({uploadedVideos.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {uploadedVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative group"
                  >
                    <button
                      onClick={() => {
                        setUploadedFile(new File([''], video.name, { type: 'video/mp4' }));
                        setIsUploadValid(true);
                        setCompletedSteps(prev => new Set([...prev, 'upload', 'roi']));
                        setActiveTab('processing');
                      }}
                      className="w-full p-3 rounded-lg bg-background/50 border border-amber-500/30 hover:border-amber-500/60 transition-all text-left hover:bg-background/70"
                    >
                      <p className="font-semibold text-sm text-foreground truncate">{video.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}
                      </p>
                    </button>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeVideo(video.id);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete video"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-12">
          {TABS.map((tab, index) => {
            const status = getTabStatus(tab.id);
            const isAccessible = canAccessTab(tab.id);

            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                disabled={!isAccessible}
                onClick={() => isAccessible && setActiveTab(tab.id)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  status === 'completed'
                    ? 'border-green-500/50 bg-green-500/5 text-foreground'
                    : status === 'active'
                    ? 'border-primary bg-primary/10 text-foreground shadow-lg shadow-primary/20'
                    : 'border-border/50 bg-background/30 text-muted-foreground opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-xl mb-2">{typeof tab.icon === 'string' ? tab.icon : <tab.icon size={20} />}</div>
                <p className="font-semibold text-sm">{tab.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{tab.description}</p>

                {/* Status Badge */}
                {status === 'completed' && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500" />
                )}
                {status === 'active' && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <VideoUploadModule
                  onVideoSelected={handleVideoUploaded}
                />
              </div>
            )}

            {/* ROI Tab */}
            {activeTab === 'roi' && uploadedFile && isUploadValid && (
              <div className="space-y-6">
                <GlassPanel className="border-blue-500/30 bg-blue-500/5">
                  <p className="text-sm text-blue-600">
                    <strong>Video Selected:</strong> {uploadedFile.name}
                  </p>
                </GlassPanel>
                <ROIEditor
                  videoWidth={1280}
                  videoHeight={720}
                  onROISet={handleROISet}
                />
              </div>
            )}

            {/* Processing Tab */}
            {activeTab === 'processing' && uploadedFile && isUploadValid && roiData && (
              <div className="space-y-6">
                <GlassPanel className="border-green-500/30 bg-green-500/5">
                  <div className="space-y-2">
                    <p className="text-sm text-green-600">
                      <strong>Video:</strong> {uploadedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      <strong>ROI Configured:</strong> Queue region with {roiData.queueRegion.length} points, Stop line with {roiData.stopLine.length} points
                    </p>
                  </div>
                </GlassPanel>
                <VideoProcessingPipeline
                  videoFile={uploadedFile}
                  onAnalysisComplete={handleAnalysisComplete}
                />
                
                {/* Quick Results Summary after processing */}
                {analysisResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <GlassPanel className="border-primary/50 bg-primary/5">
                      <h4 className="font-semibold text-foreground mb-4">Analysis Complete! Quick Summary:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs text-muted-foreground">Total Vehicles</p>
                          <p className="text-xl font-bold text-foreground">
                            {analysisResults.detectionResults.reduce((sum, r) => sum + r.detections.length, 0)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs text-muted-foreground">Tracked Vehicles</p>
                          <p className="text-xl font-bold text-foreground">
                            {new Set(analysisResults.trackingResults.flatMap(r => r.tracks.map(t => t.trackId))).size}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs text-muted-foreground">Avg Queue</p>
                          <p className="text-xl font-bold text-foreground">
                            {Math.round(analysisResults.queueMetrics.reduce((sum, m) => sum + m.queueLength, 0) / analysisResults.queueMetrics.length)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs text-muted-foreground">Violations</p>
                          <p className="text-xl font-bold text-red-500">
                            {analysisResults.violations.length}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-primary mt-4">
                        ✓ Processing complete! Navigate to other tabs to view detailed results.
                      </p>
                    </GlassPanel>
                  </motion.div>
                )}
              </div>
            )}

            {/* Detection Tab */}
            {activeTab === 'detection' && analysisResults && isUploadValid && (
              <div className="space-y-6">
                <GlassPanel className="border-blue-500/30 bg-blue-500/5">
                  <p className="text-sm text-blue-600">
                    <strong>Analysis Complete:</strong> {analysisResults.fileName} processed successfully
                  </p>
                </GlassPanel>
                <DetectionResults
                  detectionResults={analysisResults.detectionResults}
                  videoWidth={1280}
                  videoHeight={720}
                />
              </div>
            )}

            {/* Tracking Tab */}
            {activeTab === 'tracking' && analysisResults && isUploadValid && (
              <div className="space-y-6">
                <ObjectTracking
                  trackingResults={analysisResults.trackingResults}
                  videoWidth={1280}
                  videoHeight={720}
                />
              </div>
            )}

            {/* Violations Tab */}
            {activeTab === 'violations' && analysisResults && isUploadValid && (
              <div className="space-y-6">
                <TrafficViolationDetection
                  violations={analysisResults.violations}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress Summary */}
        {uploadedFile && isUploadValid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <GlassPanel>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Analysis Progress</h3>

                <div className="space-y-3">
                  {TABS.map(tab => {
                    const status = getTabStatus(tab.id);
                    const isCompleted = completedSteps.has(tab.id);

                    return (
                      <div key={tab.id} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold text-sm ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : status === 'active'
                              ? 'bg-primary text-white'
                              : 'bg-border text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? '✓' : TABS.indexOf(tab) + 1}
                        </div>
                        <span className={isCompleted ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                          {tab.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </div>
  );
}
