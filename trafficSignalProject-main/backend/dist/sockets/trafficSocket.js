"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTrafficSocket = void 0;
const mockData_1 = require("../data/mockData");
const setupTrafficSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        // Send initial data
        socket.emit('metrics_update', mockData_1.trafficMetrics);
        // Simulate real-time updates
        const interval = setInterval(() => {
            const updatedMetrics = {
                ...mockData_1.trafficMetrics,
                totalVehicles: mockData_1.trafficMetrics.totalVehicles + Math.floor(Math.random() * 5 - 2),
                avgSpeed: Math.max(10, mockData_1.trafficMetrics.avgSpeed + Math.floor(Math.random() * 6 - 3)),
                congestionLevel: Math.min(100, Math.max(0, mockData_1.trafficMetrics.congestionLevel + Math.floor(Math.random() * 10 - 5))),
                throughput: mockData_1.trafficMetrics.throughput + Math.floor(Math.random() * 3),
            };
            socket.emit('metrics_update', updatedMetrics);
        }, 3000);
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            clearInterval(interval);
        });
    });
};
exports.setupTrafficSocket = setupTrafficSocket;
