import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Logger from './utils/logger';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for dev, restrict in prod
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => Logger.info(message.trim()) } }));

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

// Routes
import authRoutes from './routes/authRoutes';
import articleRoutes from './routes/articleRoutes';
import aiRoutes from './routes/aiRoutes';

import externalNewsRoutes from './routes/externalNewsRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/ai', aiRoutes);
// Use a specific path for external news, or mix it?
// Let's create a dedicated endpoint for pulling *fresh* news from the external API
app.use('/api/external-news', externalNewsRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// WebSocket Handling
io.on('connection', (socket) => {
    Logger.info(`New client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        Logger.info(`Client disconnected: ${socket.id}`);
    });

    // Example: Subscribe to category
    socket.on('subscribe', (category) => {
        socket.join(category);
        Logger.info(`Client ${socket.id} joined room: ${category}`);
    });
});

import { startNewsCron } from './jobs/newsCron';

// ... (socket code)

// Start Server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    Logger.info(`🚀 Server running on port ${PORT}`);
    Logger.info(`ws://localhost:${PORT} ready for connections`);

    // Start Background Jobs
    startNewsCron();
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    Logger.info('SIGTERM received. Shutting down gracefully');
    httpServer.close(() => {
        Logger.info('Process terminated');
        process.exit(0);
    });
});
