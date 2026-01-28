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

const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Socket.io Setup
setupTrafficSocket(io);

function startServer(port: number) {
    // Remove previous error listeners to avoid duplicates when retrying
    server.removeAllListeners('error');

    server.on('error', (err: any) => {
        if (err && err.code === 'EADDRINUSE') {
            console.warn(`Port ${port} is in use. Trying port ${port + 1}...`);
            // try next port after short delay
            setTimeout(() => startServer(port + 1), 500);
            return;
        }
        console.error('Server error:', err);
        process.exit(1);
    });

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        // Once listening, clear the error listeners we added for retries
        server.removeAllListeners('error');
    });
}

startServer(PORT);
