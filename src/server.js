import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ['GET', 'POST'] } });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests from this IP, please try again later.' });
app.use('/api/', limiter);
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import codeGeneratorRoutes from './routes/codeGenerator.js';
import githubRoutes from './routes/github.js';
import projectRoutes from './routes/project.js';
import chatRoutes from './routes/chat.js';
import apiKeyRoutes from './routes/apiKey.js';
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/code-generator', codeGeneratorRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/api-keys', apiKeyRoutes);
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join_chat', (data) => {
        socket.join(data.projectId);
        console.log(`User ${socket.id} joined chat room: ${data.projectId}`);
    });
    socket.on('send_message', (data) => {
        io.to(data.projectId).emit('receive_message', { userId: data.userId, message: data.message, timestamp: new Date(), projectId: data.projectId });
    });
    socket.on('start_code_generation', (data) => {
        io.to(data.projectId).emit('generation_started', { projectId: data.projectId, timestamp: new Date() });
    });
    socket.on('code_generation_progress', (data) => {
        io.to(data.projectId).emit('progress_update', { projectId: data.projectId, progress: data.progress, message: data.message, timestamp: new Date() });
    });
    socket.on('code_generation_complete', (data) => {
        io.to(data.projectId).emit('generation_complete', { projectId: data.projectId, files: data.files, totalLines: data.totalLines, timestamp: new Date() });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0' });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error', status: err.status || 500 });
});
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 XTron AI Worker Server running on port ${PORT}`);
    console.log(`📡 WebSocket server active`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
export { app, io, server };