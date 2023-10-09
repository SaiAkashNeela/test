const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

io.on('connection', socket => {
    console.log('User connected');

    socket.on('offer', (offer, userId) => {
        socket.to(userId).emit('user-connected', socket.id);
        socket.on('answer', (answer) => {
            socket.to(userId).emit('answer', answer, socket.id);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
