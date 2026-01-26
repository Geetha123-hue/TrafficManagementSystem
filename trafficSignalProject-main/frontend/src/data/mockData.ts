// Mock data for the Traffic Intelligence System

export interface Vehicle {
  id: string;
  type: 'car' | 'truck' | 'bus' | 'motorcycle' | 'auto-rickshaw';
  position: { x: number; y: number };
  speed: number;
  lane: number;
  trajectory: { x: number; y: number }[];
  color: string;
}

export interface Violation {
  id: string;
  type: 'red_light' | 'wrong_lane' | 'overspeeding' | 'rash_driving' | 'no_helmet';
  vehicleId: string;
  timestamp: Date;
  confidence: number;
  thumbnail: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
}

export interface QueueData {
  lane: number;
  length: number;
  density: number;
  avgWaitTime: number;
  congestionScore: number;
  vehicleCount: number;
}

export interface TrafficMetrics {
  totalVehicles: number;
  avgSpeed: number;
  congestionLevel: number;
  violationsToday: number;
  queueLength: number;
  throughput: number;
}

// Generate random vehicles
export const generateVehicles = (count: number): Vehicle[] => {
  const types: Vehicle['type'][] = ['car', 'truck', 'bus', 'motorcycle', 'auto-rickshaw'];
  const colors = ['#00f0ff', '#ff3366', '#00ff88', '#ffaa00', '#aa66ff'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `VH-${String(i + 1).padStart(4, '0')}`,
    type: types[Math.floor(Math.random() * types.length)],
    position: {
      x: Math.random() * 100,
      y: Math.random() * 100,
    },
    speed: Math.floor(Math.random() * 60) + 10,
    lane: Math.floor(Math.random() * 4) + 1,
    trajectory: Array.from({ length: 5 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    })),
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

// Generate violations
export const generateViolations = (): Violation[] => {
  const types: Violation['type'][] = ['red_light', 'wrong_lane', 'overspeeding', 'rash_driving', 'no_helmet'];
  const locations = ['Junction A-North', 'Junction B-East', 'Signal 12-West', 'Crossing C-South'];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `VIO-${String(i + 1).padStart(3, '0')}`,
    type: types[Math.floor(Math.random() * types.length)],
    vehicleId: `VH-${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    confidence: Math.floor(Math.random() * 20) + 80,
    thumbnail: `/placeholder.svg`,
    location: locations[Math.floor(Math.random() * locations.length)],
    severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Violation['severity'],
  }));
};

// Generate queue data
export const generateQueueData = (): QueueData[] => {
  return Array.from({ length: 4 }, (_, i) => ({
    lane: i + 1,
    length: Math.floor(Math.random() * 15) + 5,
    density: Math.random() * 0.8 + 0.2,
    avgWaitTime: Math.floor(Math.random() * 120) + 30,
    congestionScore: Math.floor(Math.random() * 100),
    vehicleCount: Math.floor(Math.random() * 20) + 5,
  }));
};

// Traffic metrics
export const trafficMetrics: TrafficMetrics = {
  totalVehicles: 247,
  avgSpeed: 34,
  congestionLevel: 67,
  violationsToday: 23,
  queueLength: 42,
  throughput: 156,
};

// Vehicle type distribution
export const vehicleDistribution = [
  { type: 'Cars', count: 120, color: 'hsl(185, 100%, 50%)' },
  { type: 'Motorcycles', count: 65, color: 'hsl(155, 100%, 50%)' },
  { type: 'Auto-rickshaws', count: 32, color: 'hsl(38, 100%, 55%)' },
  { type: 'Buses', count: 18, color: 'hsl(280, 100%, 60%)' },
  { type: 'Trucks', count: 12, color: 'hsl(348, 100%, 60%)' },
];

// Hourly traffic data
export const hourlyTraffic = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  vehicles: Math.floor(Math.sin((i - 6) * 0.3) * 50 + 100 + Math.random() * 30),
  violations: Math.floor(Math.random() * 5),
}));

// Explainability content
export const explainabilityContent = {
  queueLength: {
    title: 'Queue Length Estimation',
    description: 'Queue length is calculated by detecting stationary or slow-moving vehicles in each lane using computer vision.',
    steps: [
      'Vehicle detection using YOLO model identifies all vehicles',
      'Speed estimation determines if vehicle is queued (< 5 km/h)',
      'Spatial clustering groups vehicles by lane',
      'Queue length = Sum of vehicle lengths + gaps',
    ],
  },
  density: {
    title: 'Traffic Density Analysis',
    description: 'Density represents the occupancy percentage of road space by vehicles.',
    steps: [
      'Road region is segmented into analysis zones',
      'Vehicle bounding boxes are mapped to road coordinates',
      'Density = (Total vehicle area / Road area) × 100',
      'Weighted by vehicle type (trucks count more)',
    ],
  },
  violation: {
    title: 'Violation Detection Logic',
    description: 'AI models detect traffic rule violations in real-time with high confidence.',
    steps: [
      'Traffic light state is continuously monitored',
      'Vehicle positions are tracked frame-by-frame',
      'Rule engine checks for violations (e.g., crossing during red)',
      'Multiple frame confirmation reduces false positives',
    ],
  },
};
