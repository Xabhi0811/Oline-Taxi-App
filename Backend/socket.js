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
        console.log('[Socket] New connection:', socket.id);

        socket.on('json', async (data) => {
            const { userId, userType } = data;

            console.log(`[Socket] Received json: userType=${userType}, userId=${userId}, socketId=${socket.id}`);

            try {
                if (userType === 'user') {
                    const updatedUser = await userModel.findByIdAndUpdate(
                        userId,
                        { socketID: socket.id },
                        { new: true }
                    );
                    console.log('[Socket] Updated user:', updatedUser);
                } else if (userType === 'captain') {
                    const updatedCaptain = await captainModel.findByIdAndUpdate(
                        userId,
                        { socketId: socket.id },
                        { new: true }
                    );
                    console.log('[Socket] Updated captain:', updatedCaptain);
                } else {
                    console.warn('[Socket] Unknown userType:', userType);
                }
            } catch (err) {
                console.error('[Socket] Error updating socketId in DB:', err);
            }
        });

        connectedSockets.set(socket.id, socket);

        socket.on('disconnect', async () => {
            console.log(`[Socket] Disconnected: ${socket.id}`);
            connectedSockets.delete(socket.id);

            try {
                const userResult = await userModel.findOneAndUpdate(
                    { socketID: socket.id },
                    { socketID: null }
                );
                const captainResult = await captainModel.findOneAndUpdate(
                    { socketId: socket.id },
                    { socketId: null }
                );

                console.log('[Socket] Cleaned up user socketID:', userResult !== null);
                console.log('[Socket] Cleaned up captain socketId:', captainResult !== null);
            } catch (err) {
                console.error('[Socket] Error during disconnect cleanup:', err);
            }
        });

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
        console.error('[Socket] Socket.io not initialized');
        return;
    }
    const socket = connectedSockets.get(toSocketId);
    if (socket) {
        socket.emit(event, message);
    } else {
        console.warn(`[Socket] Socket with ID ${toSocketId} not found.`);
    }
}

module.exports = {
    initializeSocket,
    sendMessage
};
