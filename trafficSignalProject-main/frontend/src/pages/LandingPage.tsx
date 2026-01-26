import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CityScene from '@/components/3d/CityScene';
import { ArrowRight, Activity, Shield, Brain, Cpu, BarChart3, Globe, Zap, Users, TrendingUp, Radio, MessageCircle } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import Chatbot from '@/components/Chatbot';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const [showChatbot, setShowChatbot] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'analytics', 'about'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureList = [
    { icon: Activity, title: 'Real-time Detection', desc: 'Identify vehicles, pedestrians, and cyclists with 99% accuracy using advanced computer vision.' },
    { icon: Shield, title: 'Violation Logging', desc: 'Automatic detection and evidence capture with complete audit trails for traffic violations.' },
    { icon: Brain, title: 'AI Reasoning', desc: 'Understand every decision with built-in explainability for transparent traffic management.' },
    { icon: BarChart3, title: 'Traffic Flow', desc: 'Optimize signal phases intelligently based on live congestion and demand data.' },
    { icon: Cpu, title: 'Edge Computing', desc: 'Process data locally with ultra-low latency for instant responsive control.' },
    { icon: Zap, title: 'Smart Sync', desc: 'Connect multiple intersections for city-wide coordination and green wave optimization.' },
  ];

  const stats = [
    { value: '99%', label: 'Detection Accuracy' },
    { value: '50ms', label: 'Response Time' },
    { value: '40%', label: 'Traffic Reduction' },
    { value: '24/7', label: 'Monitoring' },
  ];

  return (
    <div className="bg-background text-foreground selection:bg-primary/30 min-h-screen">
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

      {/* 3D Background - Fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CityScene className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/40 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => scrollTo('hero')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Radio className="text-primary" size={20} />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight">TrafficAI</span>
              <p className="text-xs text-muted-foreground">Intelligent Mobility</p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-10">
            {['features', 'analytics', 'about'].map((item) => (
              <motion.button
                key={item}
                onClick={() => scrollTo(item)}
                className={`text-sm font-medium capitalize transition-all relative group ${activeSection === item ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                whileHover={{ y: -2 }}
              >
                {item}
                <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary transition-all duration-300 ${activeSection === item ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
            >
              Dashboard
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-32 px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl"
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-10"
            whileInView={{ scale: 1.05 }}
            viewport={{ once: true }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Next-Gen Traffic Management</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.95] text-white">
            <span className="text-gradient-primary block">Intelligent</span>
            <span className="block">Urban Mobility</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Transform your city's traffic management with AI-powered intelligence. Real-time monitoring, predictive optimization, and explainable decisions for safer, faster, and more efficient streets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="group relative px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base overflow-hidden flex items-center gap-2 shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all"
            >
              <span className="relative z-10">Access Dashboard</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo('features')}
              className="px-8 py-3.5 rounded-lg bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition-all"
            >
              Learn More
            </motion.button>
          </div>

          {/* Stats Row */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground/40"
        >
          <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-2">
            <motion.div className="w-1 h-2 bg-current rounded-full" animate={{ y: [0, 4, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to manage modern urban traffic with intelligence and precision</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <GlassPanel className="h-full p-6 md:p-8 hover:border-primary/40 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <feature.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-center"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">Advanced Analytics</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Get deep insights into traffic patterns, vehicle behavior, and signal optimization opportunities. Our AI-driven analytics platform provides actionable intelligence for city planners and traffic engineers.
              </p>
              <ul className="space-y-4">
                {['Real-time data visualization', 'Predictive congestion modeling', 'Performance benchmarking', 'Custom report generation'].map((item, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center gap-3"
                    whileInView={{ x: 0, opacity: 1 }}
                    initial={{ x: -20, opacity: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassPanel className="p-8">
                <div className="space-y-8">
                  {[
                    { label: 'Traffic Flow', value: '94%', icon: TrendingUp },
                    { label: 'Signal Efficiency', value: '87%', icon: BarChart3 },
                    { label: 'System Uptime', value: '99.9%', icon: Activity },
                  ].map((metric, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-muted-foreground">{metric.label}</span>
                        <span className="text-2xl font-bold text-primary">{metric.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: metric.value }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">About TrafficAI</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Built with cutting-edge machine learning and computer vision, TrafficAI represents the next generation of intelligent traffic management. Our platform processes millions of data points in real-time to optimize urban mobility, reduce congestion, and improve safety.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all"
            >
              Try Now <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-background/40 backdrop-blur py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Radio className="text-primary" size={20} />
                <span className="font-bold">TrafficAI</span>
              </div>
              <p className="text-sm text-muted-foreground">Intelligent traffic management for modern cities.</p>
            </div>
            {[
              { title: 'Product', links: ['Dashboard', 'Features', 'Pricing'] },
              { title: 'Company', links: ['About', 'Blog', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2026 TrafficAI. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">Engineered for the future of urban mobility</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
