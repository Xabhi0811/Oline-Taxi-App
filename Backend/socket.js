const { Server } = require('socket.io');
const userModel = require('./models/user.model')
const captainModel = require('./models/captain.module')
let io;

// Store connected sockets
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
         
        socket.on('json', async(data) =>{
            const {userId , userType} = data
            if(userType === 'user'){
                await userModel.findByIdAndUpdate(userId ,{
                    socketID: socket.id
                } )
            }
            else if(userType === 'captain'){
                await captainModel.findByIdAndUpdate(userId,{socketId: socketid})
            }
                socket.on('disconect', () =>{
                    console.log(`Client disconnected: ${socket.id}`);
                })
            
        })

        connectedSockets.set(socket.id, socket);

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
            connectedSockets.delete(socket.id);
        });

        // Example: receive and broadcast a chat message
        socket.on('chat-message', ({ toSocketId, message }) => {
            sendMessage(toSocketId, 'chat-message', { from: socket.id, message });
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
