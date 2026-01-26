import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import { explainabilityContent } from '@/data/mockData';
import { Brain, ChevronRight, Lightbulb, ArrowRight, X } from 'lucide-react';

interface ExplainabilityOverlayProps {
  isEnabled: boolean;
  onClose: () => void;
}

export default function ExplainabilityOverlay({ isEnabled, onClose }: ExplainabilityOverlayProps) {
  const [activeSection, setActiveSection] = useState<keyof typeof explainabilityContent>('queueLength');

  if (!isEnabled) return null;

  const sections = [
    { key: 'queueLength' as const, label: 'Queue Length', icon: '📊' },
    { key: 'density' as const, label: 'Traffic Density', icon: '🔥' },
    { key: 'violation' as const, label: 'Violations', icon: '🚨' },
  ];

  const content = explainabilityContent[activeSection];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-4xl"
        >
          <GlassPanel className="p-6" hover={false} glow="cyan">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-3 rounded-xl bg-primary/10"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Brain className="text-primary" size={28} />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold">AI Explainability Mode</h2>
                  <p className="text-sm text-muted-foreground">
                    Understand how our AI makes decisions
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Section tabs */}
            <div className="flex gap-2 mb-6">
              {sections.map((section) => (
                <motion.button
                  key={section.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeSection === section.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <span>{section.icon}</span>
                  {section.label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Title and description */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="text-warning" size={20} />
                    {content.title}
                  </h3>
                  <p className="text-muted-foreground">{content.description}</p>
                </div>

                {/* Step by step */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Step-by-Step Process
                  </h4>
                  {content.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-mono text-primary text-sm font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p>{step}</p>
                      </div>
                      {i < content.steps.length - 1 && (
                        <ArrowRight size={16} className="text-muted-foreground mt-1.5" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Visual diagram */}
                <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="px-3 py-2 rounded-lg bg-muted font-mono">Video Frame</div>
                    <ChevronRight className="text-primary" />
                    <div className="px-3 py-2 rounded-lg bg-muted font-mono">AI Model</div>
                    <ChevronRight className="text-primary" />
                    <div className="px-3 py-2 rounded-lg bg-muted font-mono">Detection</div>
                    <ChevronRight className="text-primary" />
                    <div className="px-3 py-2 rounded-lg bg-primary/20 font-mono text-primary">
                      Result
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
