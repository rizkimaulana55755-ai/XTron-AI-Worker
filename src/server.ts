import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

// Configuration for API key management
const API_KEYS = {
    provider1: 'YOUR_API_KEY_1',
    provider2: 'YOUR_API_KEY_2',
};

// Middleware for API key verification
function checkApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || !Object.values(API_KEYS).includes(apiKey)) {
        return res.status(403).json({ message: 'Forbidden - Invalid API key' });
    }
    next();
}

app.use(checkApiKey);

// GitHub integration endpoint
app.post('/github/webhook', (req, res) => {
    // Handle GitHub webhook events here
    console.log('GitHub event received:', req.body);
    res.status(200).send('Webhook received');
});

// Project management functionality
app.get('/projects', (req, res) => {
    // Placeholder for project management logic
    res.json([{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }]);
});

// Chat functionality
app.post('/chat', (req, res) => {
    const { message } = req.body;
    io.emit('chat message', message);
    res.status(200).send('Message sent');
});

// Code generation endpoint
app.post('/generate-code', (req, res) => {
    const { codeRequest } = req.body;
    // Placeholder for code generation logic
    res.json({ code: 'Generated code based on request' });
});

// Socket.IO setup for real-time communication
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
