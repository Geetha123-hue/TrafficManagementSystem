"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueData = exports.violations = exports.trafficMetrics = void 0;
exports.trafficMetrics = {
    totalVehicles: 247,
    avgSpeed: 34,
    congestionLevel: 67,
    violationsToday: 23,
    queueLength: 42,
    throughput: 156,
};
exports.violations = [
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
exports.queueData = [
    { lane: 1, length: 12, density: 0.45, avgWaitTime: 45, congestionScore: 30, vehicleCount: 8 },
    { lane: 2, length: 25, density: 0.85, avgWaitTime: 110, congestionScore: 85, vehicleCount: 15 },
    { lane: 3, length: 8, density: 0.30, avgWaitTime: 20, congestionScore: 15, vehicleCount: 5 },
    { lane: 4, length: 18, density: 0.60, avgWaitTime: 65, congestionScore: 50, vehicleCount: 10 },
];
