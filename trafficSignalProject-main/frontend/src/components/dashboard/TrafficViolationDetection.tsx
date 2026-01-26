import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { ViolationData } from './VideoProcessingPipeline';

interface TrafficViolationDetectionProps {
  violations: ViolationData[];
}

interface ViolationStats {
  type: string;
  count: number;
  percentage: number;
  avgConfidence: number;
}

export default function TrafficViolationDetection({
  violations,
}: TrafficViolationDetectionProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [violationStats, setViolationStats] = useState<ViolationStats[]>([]);
  const [filteredViolations, setFilteredViolations] = useState<ViolationData[]>([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

  // Calculate statistics
  useEffect(() => {
    const typeMap = new Map<string, { count: number; confidenceSum: number }>();
    let total = 0;

    violations.forEach(violation => {
      total++;
      const stats = typeMap.get(violation.type) || {
        count: 0,
        confidenceSum: 0,
      };
      stats.count++;
      stats.confidenceSum += violation.confidence;
      typeMap.set(violation.type, stats);
    });

    const stats = Array.from(typeMap.entries())
      .map(([type, data]) => ({
        type,
        count: data.count,
        percentage: total > 0 ? (data.count / total) * 100 : 0,
        avgConfidence: data.count > 0 ? data.confidenceSum / data.count : 0,
      }))
      .sort((a, b) => b.count - a.count);

    setViolationStats(stats);

    // Filter by confidence threshold
    setFilteredViolations(
      violations.filter(v => v.confidence >= confidenceThreshold)
    );
  }, [violations, confidenceThreshold]);

  const violationIcons: Record<string, string> = {
    'red-light-jump': '🚨',
    'rash-driving': '⚡',
    'lane-violation': '🛣️',
  };

  const violationColors: Record<string, string> = {
    'red-light-jump': 'bg-red-500/20 text-red-500 border-red-500/30',
    'rash-driving': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    'lane-violation': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  };

  const riskLevel = (confidence: number): 'critical' | 'high' | 'medium' => {
    if (confidence >= 0.9) return 'critical';
    if (confidence >= 0.75) return 'high';
    return 'medium';
  };

  const getRiskColor = (level: 'critical' | 'high' | 'medium') => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-500/10';
      case 'high':
        return 'text-orange-600 bg-orange-500/10';
      case 'medium':
        return 'text-yellow-600 bg-yellow-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Violation Overview */}
      <GlassPanel>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              Traffic Violation Detection
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              AI-detected rule violations and rash driving incidents
            </p>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-background/50 border border-border hover:border-red-500/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground">Total Violations</p>
              <p className="text-3xl font-bold text-red-500 mt-1">
                {violations.length}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-background/50 border border-border hover:border-orange-500/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground">Critical Risk</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">
                {violations.filter(v => riskLevel(v.confidence) === 'critical').length}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-background/50 border border-border hover:border-blue-500/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
              <p className="text-3xl font-bold text-blue-500 mt-1">
                {violations.length > 0
                  ? (
                      (violations.reduce((sum, v) => sum + v.confidence, 0) /
                        violations.length) *
                      100
                    ).toFixed(1)
                  : '0'}
                %
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-background/50 border border-border hover:border-green-500/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground">Unique Vehicles</p>
              <p className="text-3xl font-bold text-green-500 mt-1">
                {new Set(violations.map(v => v.vehicleId)).size}
              </p>
            </motion.div>
          </div>
        </div>
      </GlassPanel>

      {/* Violation Type Breakdown */}
      <GlassPanel>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Violation Types</h3>

          <div className="space-y-3">
            {violationStats.map((stat, index) => {
              const isSelected = selectedType === stat.type;

              return (
                <motion.button
                  key={stat.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedType(isSelected ? null : stat.type)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background/50 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">
                        {violationIcons[stat.type] || '⚠️'}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold text-foreground capitalize">
                          {stat.type.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg Confidence: {(stat.avgConfidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-500">
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
                      className={`h-full rounded-full ${violationColors[stat.type]}`}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </GlassPanel>

      {/* Confidence Threshold Filter */}
      <GlassPanel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Filter size={18} />
              Confidence Filter
            </h3>
            <span className="text-xl font-bold text-primary">
              {(confidenceThreshold * 100).toFixed(0)}%+
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={confidenceThreshold}
            onChange={e => setConfidenceThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-background rounded-full appearance-none cursor-pointer accent-primary"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
            <span>Very High</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Showing {filteredViolations.length} of {violations.length} violations
          </p>
        </div>
      </GlassPanel>

      {/* Violation Details */}
      <GlassPanel>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Violation Details
            </h3>
            {filteredViolations.length > 0 && (
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export Report
              </Button>
            )}
          </div>

          {filteredViolations.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredViolations
                  .sort((a, b) => b.confidence - a.confidence)
                  .map((violation, index) => {
                    const risk = riskLevel(violation.confidence);

                    return (
                      <motion.div
                        key={`${violation.vehicleId}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all ${
                          risk === 'critical' ? 'border-red-500/50 bg-red-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">
                                {violationIcons[violation.type] || '⚠️'}
                              </span>
                              <p className="font-semibold text-foreground capitalize">
                                {violation.type.replace(/-/g, ' ')}
                              </p>
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(risk)}`}
                              >
                                {risk.toUpperCase()}
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {violation.description}
                            </p>

                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Vehicle: {violation.vehicleId}</span>
                              <span>Frame: {violation.frameNumber}</span>
                              <span>Time: {violation.timestamp.toFixed(2)}s</span>
                            </div>
                          </div>

                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-primary">
                              {(violation.confidence * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Confidence
                            </p>
                          </div>
                        </div>

                        {/* Confidence Bar */}
                        <div className="mt-3 w-full bg-background rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${violation.confidence * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${
                              risk === 'critical'
                                ? 'bg-red-500'
                                : risk === 'high'
                                ? 'bg-orange-500'
                                : 'bg-yellow-500'
                            }`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="text-green-500 mx-auto mb-3" size={32} />
              <p className="text-muted-foreground">
                No violations detected at this confidence threshold
              </p>
            </div>
          )}
        </div>
      </GlassPanel>

      {/* High-Risk Summary */}
      {violations.filter(v => riskLevel(v.confidence) === 'critical').length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel className="border-red-500/30 bg-red-500/5">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                <AlertTriangle size={20} />
                Critical Risk Summary
              </h3>

              {violations
                .filter(v => riskLevel(v.confidence) === 'critical')
                .slice(0, 5)
                .map((violation, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-background/50 border border-red-500/20"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {violation.type.replace(/-/g, ' ').toUpperCase()} - Frame{' '}
                      {violation.frameNumber}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {violation.description}
                    </p>
                  </div>
                ))}
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </div>
  );
}
