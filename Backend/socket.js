const { Server } = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.module');
let io;

const connectedSockets = new Map();

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        // Handle custom 'json' event
        socket.on('json', async (data) => {
             console.log('Received json event:', data);
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, {
                    socketId: socket.id
                });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, {
                    socketID: socket.id
                });
            }
        });

        connectedSockets.set(socket.id, socket);

        // Clean up on disconnect
        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            connectedSockets.delete(socket.id);

            // Optional: also remove from DB
            await userModel.findOneAndUpdate({ socketID: socket.id }, { socketID: null });
            await captainModel.findOneAndUpdate({ socketID: socket.id }, { socketID: null });
        });

        // Example: Chat feature
        socket.on('chat-message', ({ toSocketId, message }) => {
            sendMessage(toSocketId, 'chat-message', {
                from: socket.id,
                message
            });
        });
    });
}

function sendMessage(toSocketId, event, message) {
    if (!io) {
        console.error('Socket.io not initialized');
        return;
    }
    const socket = connectedSockets.get(toSocketId);
    if (socket) {
        socket.emit(event, message);
    } else {
        console.warn(`Socket with id ${toSocketId} not found.`);
    }
}

module.exports = {
    initializeSocket,
    sendMessage
};
