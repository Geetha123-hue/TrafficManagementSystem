import { Request, Response } from 'express';

// Traffic-related keywords for validation
const TRAFFIC_KEYWORDS = [
  'traffic', 'congestion', 'violation', 'infraction', 'queue', 'wait', 'vehicle', 'car',
  'speed', 'km/h', 'mph', 'signal', 'phase', 'intersection', 'road', 'street', 'lane',
  'detection', 'tracking', 'monitoring', 'ai', 'analysis', 'optimization', 'pedestrian',
  'bus', 'truck', 'motorcycle', 'accident', 'incident', 'flow', 'throughput', 'density',
  'peak', 'hour', 'commute', 'rush', 'red light', 'stop line', 'cross', 'crossing'
];

// Check if message is traffic-related
const isTrafficRelated = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Greeting and help keywords are allowed
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
      lowerMessage.includes('help') || lowerMessage.includes('feature') ||
      lowerMessage.includes('how') || lowerMessage.includes('what') ||
      lowerMessage.includes('can you')) {
    // Check if combined with traffic keywords
    return TRAFFIC_KEYWORDS.some(keyword => lowerMessage.includes(keyword)) ||
           lowerMessage.includes('help') || lowerMessage.includes('feature');
  }
  
  // Check if message contains any traffic-related keyword
  return TRAFFIC_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

// Simple AI responses based on traffic-related queries
const generateChatResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Traffic-related responses
  if (lowerMessage.includes('traffic') || lowerMessage.includes('congestion')) {
    return 'Current traffic levels are being monitored in real-time. The AI system is optimizing signal phases to reduce congestion. Would you like me to show you the congestion heatmap?';
  }
  
  if (lowerMessage.includes('violation') || lowerMessage.includes('infraction')) {
    return 'Our violation detection system uses AI to identify traffic violations in real-time with 99% accuracy. We log evidence automatically and provide detailed reports. Check the Violations tab in the dashboard for more details.';
  }
  
  if (lowerMessage.includes('queue') || lowerMessage.includes('wait')) {
    return 'Queue lengths are being optimized through intelligent signal timing. Real-time adjustments are made based on vehicle demand at each intersection. Visit the Queue Analysis section to view detailed metrics.';
  }
  
  if (lowerMessage.includes('vehicle') || lowerMessage.includes('car')) {
    return 'We track all vehicles in real-time with AI-powered detection. Our system identifies vehicle types, counts, speeds, and can detect anomalies. The Vehicle Tracking tab shows live tracking data.';
  }
  
  if (lowerMessage.includes('speed') || lowerMessage.includes('km/h') || lowerMessage.includes('mph')) {
    return 'Current average speed across intersections is displayed on the dashboard. Our AI adjusts signal timing to maintain optimal flow while ensuring safety.';
  }
  
  if (lowerMessage.includes('signal') || lowerMessage.includes('phase')) {
    return 'Traffic signal phases are intelligently optimized by our AI system. Each phase is adjusted based on real-time demand, historical patterns, and predictive analytics to maximize throughput.';
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('feature')) {
    return `I can help you with: traffic monitoring, violation detection, queue analysis, vehicle tracking, signal optimization, and real-time analytics. What would you like to know more about?`;
  }
  
  if (lowerMessage.includes('accuracy') || lowerMessage.includes('performance')) {
    return 'Our AI system achieves 99% detection accuracy with 50ms response time. System uptime is 99.9% with automated failover mechanisms. Traffic reduction in optimized areas averages 40%.';
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! I\'m TrafficAI Assistant. I\'m here to help you understand traffic management, answer questions about our AI system, and guide you through the platform. What would you like to know?';
  }
  
  if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
    return 'TrafficAI uses computer vision, machine learning, and real-time data processing to monitor intersections. Our AI learns traffic patterns and predicts congestion, then optimizes signal timing automatically.';
  }
  
  // Default traffic-related response
  return 'That\'s a great traffic-related question! I can help you with traffic management, violations, vehicle tracking, queue analysis, intersection optimization, or how our AI system works. What would you like to know?';
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required and must be a string' });
      return;
    }

    // Check if message is traffic-related
    if (!isTrafficRelated(message)) {
      res.json({
        success: false,
        message: 'I can only help with traffic-related questions. Please ask me about traffic management, violations, vehicle tracking, queue analysis, signal optimization, or how our AI system works.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Generate response from chatbot
    const response = generateChatResponse(message);

    // Simulate slight delay for realistic API response
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      success: true,
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real app, this would fetch from a database
    res.json({
      success: true,
      messages: [],
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};
