const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*", // Allow all origins (adjust this in production)
        methods: ["GET", "POST"]
    }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Relay the offer from iPad to the browser
    socket.on('offer', (data) => {
        console.log('Server: Offer received from:', socket.id);
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        console.log('Server: Answer received from:', socket.id);
        socket.broadcast.emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        console.log('Server: ICE candidate received from:', socket.id);
        socket.broadcast.emit('ice-candidate', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = 8181;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});