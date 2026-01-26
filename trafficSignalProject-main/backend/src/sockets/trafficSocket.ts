import { Server } from 'socket.io';
import { trafficMetrics } from '../data/mockData';

export const setupTrafficSocket = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Send initial data
        socket.emit('metrics_update', trafficMetrics);

        // Simulate real-time updates
        const interval = setInterval(() => {
            const updatedMetrics = {
                ...trafficMetrics,
                totalVehicles: trafficMetrics.totalVehicles + Math.floor(Math.random() * 5 - 2),
                avgSpeed: Math.max(10, trafficMetrics.avgSpeed + Math.floor(Math.random() * 6 - 3)),
                congestionLevel: Math.min(100, Math.max(0, trafficMetrics.congestionLevel + Math.floor(Math.random() * 10 - 5))),
                throughput: trafficMetrics.throughput + Math.floor(Math.random() * 3),
            };

            socket.emit('metrics_update', updatedMetrics);
        }, 3000);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            clearInterval(interval);
        });
    });
};
