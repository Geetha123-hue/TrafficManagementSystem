import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BarChart3, AlertTriangle, Zap, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import VideoUploadModule from './VideoUploadModule';
import VideoProcessingPipeline, { AnalysisResults } from './VideoProcessingPipeline';
import DetectionResults from './DetectionResults';
import ObjectTracking from './ObjectTracking';
import TrafficViolationDetection from './TrafficViolationDetection';
import ROIEditor, { ROIData } from './ROIEditor';

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
  const [activeTab, setActiveTab] = useState<AnalysisTab>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [roiData, setROIData] = useState<ROIData | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<AnalysisTab>>(new Set());

  const handleVideoUploaded = (file: File) => {
    setUploadedFile(file);
    setCompletedSteps(prev => new Set([...prev, 'upload']));
    setActiveTab('roi');
  };

  const handleROISet = (roi: ROIData) => {
    setROIData(roi);
    setCompletedSteps(prev => new Set([...prev, 'roi']));
    setActiveTab('processing');
  };

  const handleAnalysisComplete = (results: AnalysisResults) => {
    setAnalysisResults(results);
    setCompletedSteps(prev => new Set([...prev, 'processing', 'detection', 'tracking', 'violations']));
    setActiveTab('detection');
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
            {activeTab === 'roi' && uploadedFile && (
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
            {activeTab === 'processing' && uploadedFile && roiData && (
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
              </div>
            )}

            {/* Detection Tab */}
            {activeTab === 'detection' && analysisResults && (
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
            {activeTab === 'tracking' && analysisResults && (
              <div className="space-y-6">
                <ObjectTracking
                  trackingResults={analysisResults.trackingResults}
                  videoWidth={1280}
                  videoHeight={720}
                />
              </div>
            )}

            {/* Violations Tab */}
            {activeTab === 'violations' && analysisResults && (
              <div className="space-y-6">
                <TrafficViolationDetection
                  violations={analysisResults.violations}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress Summary */}
        {uploadedFile && (
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
