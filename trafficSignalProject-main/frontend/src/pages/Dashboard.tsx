import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Car, AlertTriangle, Clock, Gauge, TrendingUp,
  Brain, Menu, X, Home, ChevronLeft, MessageCircle, Upload
} from 'lucide-react';
import MetricCard from '@/components/ui/MetricCard';
import TrafficVideoPanel from '@/components/dashboard/TrafficVideoPanel';
import QueueAnalytics from '@/components/dashboard/QueueAnalytics';
import ViolationCards from '@/components/dashboard/ViolationCards';
import VehicleDistribution from '@/components/dashboard/VehicleDistribution';
import TrafficTimeline from '@/components/dashboard/TrafficTimeline';
import VehicleTimeline from '@/components/dashboard/VehicleTimeline';
import ExplainabilityOverlay from '@/components/dashboard/ExplainabilityOverlay';
import VehicleProfileModal from '@/components/dashboard/VehicleProfileModal';
import AudioAlerts from '@/components/dashboard/AudioAlerts';
import SignalPhaseTimeline from '@/components/dashboard/SignalPhaseTimeline';
import GlassPanel from '@/components/ui/GlassPanel';
import Chatbot from '@/components/Chatbot';
import { trafficMetrics } from '@/data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(trafficMetrics);
  const [showExplainability, setShowExplainability] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatbot, setShowChatbot] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalVehicles: prev.totalVehicles + Math.floor(Math.random() * 5 - 2),
        avgSpeed: Math.max(10, prev.avgSpeed + Math.floor(Math.random() * 6 - 3)),
        congestionLevel: Math.min(100, Math.max(0, prev.congestionLevel + Math.floor(Math.random() * 10 - 5))),
        throughput: prev.throughput + Math.floor(Math.random() * 3),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Chatbot Widget */}
      <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

      {/* Floating Chatbot Toggle - when minimized */}
      {!showChatbot && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-shadow"
        >
          <MessageCircle size={24} />
        </motion.button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            className="w-72 border-r border-border bg-sidebar flex-shrink-0 relative flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30">
                  <Activity className="text-primary" size={24} />
                </div>
                <div>
                  <h1 className="font-bold text-lg">TrafficAI</h1>
                  <p className="text-xs text-muted-foreground">Control Center</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {[
                { id: 'dashboard', icon: Home, label: 'Dashboard', count: undefined },
                { id: 'tracking', icon: Car, label: 'Vehicle Tracking', count: undefined },
                { id: 'violations', icon: AlertTriangle, label: 'Violations', count: metrics.violationsToday },
                { id: 'queue', icon: Gauge, label: 'Queue Analysis', count: undefined },
                { id: 'analytics', icon: TrendingUp, label: 'Analytics', count: undefined },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${activeTab === item.id
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/40 border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.count > 0 ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'}`}>
                      {item.count}
                    </span>
                  )}
                </motion.button>
              ))}

              {/* Divider */}
              <div className="my-4 border-t border-sidebar-border/30" />

              {/* Video Upload Link */}
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/video-upload')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/40 border border-transparent transition-all duration-200"
              >
                <Upload size={18} />
                Video Upload
              </motion.button>

              {/* Video Analytics Link */}
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/video-analytics')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/40 border border-transparent transition-all duration-200"
              >
                <Brain size={18} />
                AI Video Analytics
              </motion.button>
            </nav>

            {/* AI Explanation */}
            <div className="p-4 border-t border-sidebar-border space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowExplainability(true)}
                className="w-full flex items-start gap-3 px-4 py-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 hover:border-primary/50 transition-all group"
              >
                <Brain className="text-primary mt-1 flex-shrink-0" size={20} />
                <div className="text-left">
                  <div className="text-sm font-semibold group-hover:text-primary transition-colors">Explainable AI</div>
                  <div className="text-xs text-muted-foreground">View decision logic</div>
                </div>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
            >
              <ChevronLeft size={18} />
              <span className="text-sm font-medium">Back Home</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-sm font-medium">System Active</span>
            </div>
            <div className="text-sm text-muted-foreground font-mono px-4 py-2 rounded-lg bg-muted/40">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-[2000px] mx-auto space-y-8">
            {/* Content Switcher */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Metrics Header */}
                <div>
                  <h2 className="text-3xl font-bold mb-6">Traffic Metrics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <MetricCard
                      title="Total Vehicles"
                      value={metrics.totalVehicles}
                      icon={<Car size={18} />}
                      trend="up"
                      trendValue="+12"
                      delay={0}
                    />
                    <MetricCard
                      title="Avg Speed"
                      value={metrics.avgSpeed}
                      suffix=" km/h"
                      icon={<Gauge size={18} />}
                      trend="neutral"
                      trendValue="stable"
                      delay={0.1}
                    />
                    <MetricCard
                      title="Congestion"
                      value={metrics.congestionLevel}
                      suffix="%"
                      icon={<TrendingUp size={18} />}
                      variant={metrics.congestionLevel > 70 ? 'danger' : metrics.congestionLevel > 40 ? 'warning' : 'success'}
                      delay={0.2}
                    />
                    <MetricCard
                      title="Violations"
                      value={metrics.violationsToday}
                      icon={<AlertTriangle size={18} />}
                      variant="danger"
                      trend="down"
                      trendValue="-5"
                      delay={0.3}
                    />
                    <MetricCard
                      title="Queue Length"
                      value={metrics.queueLength}
                      suffix=" m"
                      icon={<Activity size={18} />}
                      delay={0.4}
                    />
                    <MetricCard
                      title="Throughput"
                      value={metrics.throughput}
                      suffix="/h"
                      icon={<TrendingUp size={18} />}
                      variant="success"
                      delay={0.5}
                    />
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Video Panel - Takes 2 columns */}
                  <div className="lg:col-span-2 space-y-6">
                    <motion.div 
                      className="rounded-2xl overflow-hidden border border-border shadow-xl"
                      whileHover={{ borderColor: 'hsl(var(--primary))' }}
                    >
                      <div className="glass-panel p-0 rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 relative">
                        <TrafficVideoPanel
                          heatmapEnabled={heatmapEnabled}
                          onVehicleClick={setSelectedVehicle}
                        />
                        {/* Overlay Controls */}
                        <div className="absolute top-6 right-6 flex gap-3 z-10">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setHeatmapEnabled(!heatmapEnabled)}
                            className={`p-3 rounded-lg backdrop-blur-md transition-all border font-medium text-sm ${heatmapEnabled ? 'bg-primary/30 border-primary text-primary shadow-lg shadow-primary/20' : 'bg-black/50 border-white/10 text-muted-foreground hover:bg-black/70'}`}
                            title="Toggle Heatmap"
                          >
                            <TrendingUp size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAudioEnabled(!audioEnabled)}
                            className={`p-3 rounded-lg backdrop-blur-md transition-all border font-medium text-sm ${audioEnabled ? 'bg-primary/30 border-primary text-primary shadow-lg shadow-primary/20' : 'bg-black/50 border-white/10 text-muted-foreground hover:bg-black/70'}`}
                            title="Toggle Audio Alerts"
                          >
                            <Activity size={18} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <SignalPhaseTimeline />
                    </motion.div>
                  </div>

                  {/* Violation Cards */}
                  <motion.div 
                    className="h-fit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ViolationCards />
                  </motion.div>
                </div>

                {/* Middle Row - Vehicle Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <VehicleTimeline />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <QueueAnalytics />
                  </motion.div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <VehicleDistribution />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <TrafficTimeline />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tracking' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold">Live Vehicle Tracking</h2>
                  <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold border border-primary/20">
                    Real-time Active
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-border shadow-xl">
                  <div className="glass-panel h-[600px] p-0 rounded-2xl border-primary/20">
                    <TrafficVideoPanel />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <VehicleTimeline />
                  <VehicleDistribution />
                </div>
              </motion.div>
            )}

            {activeTab === 'violations' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Violation Detection</h2>
                    <p className="text-muted-foreground">Real-time monitoring and evidence capture</p>
                  </div>
                  <div className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-mono font-semibold border border-destructive/20">
                    {metrics.violationsToday} Today
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ViolationCards />
                  <ViolationCards />
                  <ViolationCards />
                </div>
              </motion.div>
            )}

            {activeTab === 'queue' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">Queue Analysis</h2>
                  <p className="text-muted-foreground">Monitor traffic queue lengths and wait times</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <QueueAnalytics />
                  <QueueAnalytics />
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">System Analytics</h2>
                  <p className="text-muted-foreground">Comprehensive performance metrics and insights</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <VehicleDistribution />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <TrafficTimeline />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <VehicleTimeline />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <GlassPanel className="p-6 border-border rounded-2xl">
                      <h3 className="text-lg font-bold mb-6">Efficiency Metrics</h3>
                      <div className="space-y-6">
                        {[
                          { label: 'Junction 1 Flow', value: 85, color: 'from-primary to-blue-500' },
                          { label: 'Junction 2 Flow', value: 90, color: 'from-blue-500 to-cyan-500' },
                          { label: 'Junction 3 Flow', value: 78, color: 'from-cyan-500 to-green-500' },
                        ].map((metric, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold">{metric.label}</span>
                              <span className="text-lg font-bold text-primary">{metric.value}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassPanel>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Explainability Overlay */}
      <ExplainabilityOverlay
        isEnabled={showExplainability}
        onClose={() => setShowExplainability(false)}
      />

      {/* Vehicle Profile Modal */}
      <VehicleProfileModal
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        vehicleId={selectedVehicle}
      />

      {/* Audio Logic */}
      <AudioAlerts active={audioEnabled} violationCount={metrics.violationsToday} />
    </div>
  );
}
