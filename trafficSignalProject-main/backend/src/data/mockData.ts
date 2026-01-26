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

export const trafficMetrics: TrafficMetrics = {
    totalVehicles: 247,
    avgSpeed: 34,
    congestionLevel: 67,
    violationsToday: 23,
    queueLength: 42,
    throughput: 156,
};

export const violations: Violation[] = [
    {
        id: 'VIO-001',
        type: 'red_light',
        vehicleId: 'VH-0042',
        timestamp: new Date(),
        confidence: 94,
        thumbnail: '/placeholder.svg',
        location: 'Junction A-North',
        severity: 'high',
    },
    // Add more mock violations if needed
];

export const queueData: QueueData[] = [
    { lane: 1, length: 12, density: 0.45, avgWaitTime: 45, congestionScore: 30, vehicleCount: 8 },
    { lane: 2, length: 25, density: 0.85, avgWaitTime: 110, congestionScore: 85, vehicleCount: 15 },
    { lane: 3, length: 8, density: 0.30, avgWaitTime: 20, congestionScore: 15, vehicleCount: 5 },
    { lane: 4, length: 18, density: 0.60, avgWaitTime: 65, congestionScore: 50, vehicleCount: 10 },
];
