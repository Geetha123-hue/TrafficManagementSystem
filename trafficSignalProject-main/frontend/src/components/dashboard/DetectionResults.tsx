import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { DetectionResult } from './VideoProcessingPipeline';

interface DetectionResultsProps {
  detectionResults: DetectionResult[];
  videoWidth?: number;
  videoHeight?: number;
}

interface VehicleStats {
  class: string;
  count: number;
  avgConfidence: number;
  percentage: number;
}

export default function DetectionResults({
  detectionResults,
  videoWidth = 1280,
  videoHeight = 720,
}: DetectionResultsProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [vehicleStats, setVehicleStats] = useState<VehicleStats[]>([]);
  const [totalDetections, setTotalDetections] = useState(0);
  const [avgConfidence, setAvgConfidence] = useState(0);

  // Calculate statistics
  useEffect(() => {
    const classMap = new Map<string, { count: number; confidenceSum: number }>();
    let total = 0;
    let confidenceSum = 0;

    detectionResults.forEach(result => {
      result.detections.forEach(detection => {
        total++;
        confidenceSum += detection.confidence;

        const stats = classMap.get(detection.class) || {
          count: 0,
          confidenceSum: 0,
        };
        stats.count++;
        stats.confidenceSum += detection.confidence;
        classMap.set(detection.class, stats);
      });
    });

    const stats = Array.from(classMap.entries())
      .map(([vehicleClass, data]) => ({
        class: vehicleClass,
        count: data.count,
        avgConfidence: data.confidenceSum / data.count,
        percentage: (data.count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    setVehicleStats(stats);
    setTotalDetections(total);
    setAvgConfidence(total > 0 ? confidenceSum / total : 0);
  }, [detectionResults]);

  const classColors: Record<string, string> = {
    car: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    bike: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
    bus: 'bg-green-500/20 text-green-500 border-green-500/30',
    auto: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    truck: 'bg-red-500/20 text-red-500 border-red-500/30',
  };

  const classEmojis: Record<string, string> = {
    car: '🚗',
    bike: '🏍️',
    bus: '🚌',
    auto: '🚕',
    truck: '🚚',
  };

  return (
    <div className="space-y-6">
      {/* Detection Statistics */}
      <GlassPanel>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              <BarChart3 className="inline mr-2" size={20} />
              Detection Statistics
            </h3>
            <p className="text-sm text-muted-foreground">
              Vehicle detection results across all frames
            </p>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground">Total Detections</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {totalDetections}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {(avgConfidence * 100).toFixed(1)}%
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground">Vehicle Classes</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {vehicleStats.length}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground">Frames Analyzed</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {detectionResults.length}
              </p>
            </motion.div>
          </div>
        </div>
      </GlassPanel>

      {/* Vehicle Class Breakdown */}
      <GlassPanel>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Vehicle Class Breakdown</h3>

          <div className="space-y-3">
            {vehicleStats.map((stat, index) => {
              const isSelected = selectedClass === stat.class;
              const colorClass = classColors[stat.class] || 'bg-gray-500/20 text-gray-500';

              return (
                <motion.button
                  key={stat.class}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedClass(isSelected ? null : stat.class)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background/50 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">
                        {classEmojis[stat.class] || '🚗'}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold text-foreground capitalize">
                          {stat.class}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg Confidence: {(stat.avgConfidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        {stat.count}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-background rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${classColors[stat.class]}`}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </GlassPanel>

      {/* Detection Details */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassPanel>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground capitalize">
                  {selectedClass} Detections
                </h3>
                <p className="text-sm text-muted-foreground">
                  Detailed analysis of {selectedClass} vehicles detected in the video
                </p>
              </div>

              {/* Frame-wise Detection List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {detectionResults
                  .filter(result => result.detections.some(d => d.class === selectedClass))
                  .slice(0, 20)
                  .map((result, index) => {
                    const frameDetections = result.detections.filter(d => d.class === selectedClass);

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 rounded-lg bg-background/50 border border-border"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Frame {result.frameNumber}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {result.timestamp.toFixed(2)}s - {frameDetections.length} detection
                              {frameDetections.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${classColors[selectedClass]}`}
                          >
                            {frameDetections[0]?.confidence.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>

              <Button variant="outline" className="w-full">
                <Download size={16} className="mr-2" />
                Export {selectedClass.toUpperCase()} Data
              </Button>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* Detection Confidence Distribution */}
      <GlassPanel>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Confidence Distribution</h3>

          <div className="space-y-2">
            {[0.9, 0.8, 0.7, 0.6, 0.5].map(threshold => {
              const count = detectionResults.reduce(
                (sum, result) =>
                  sum +
                  result.detections.filter(d => d.confidence >= threshold).length,
                0
              );
              const percentage = (count / totalDetections) * 100;

              return (
                <div key={threshold} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground w-12">
                    {threshold * 100}%+
                  </span>
                  <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
