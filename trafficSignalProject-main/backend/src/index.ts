import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { setupTrafficSocket } from './sockets/trafficSocket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // In production, replace with frontend URL
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Socket.io Setup
setupTrafficSocket(io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
