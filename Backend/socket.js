const { Server } = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.module');

let io;
const connectedSockets = new Map();

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'https://lx36v5dk-5173.inc1.devtunnels.ms',
        'https://lx36v5dk-4000.inc1.devtunnels.ms'
      ],
      credentials: true
    }
  });

  console.log('[Socket] ✅ Socket.IO initialized');

  io.on('connection', (socket) => {
    console.log(`[Socket] 🚀 New connection: ${socket.id}`);

    // Save socket ID in user or captain DB record
    socket.on('json', async (data) => {
      const { userId, userType } = data;
      console.log(`[Socket] 📥 Received 'json' => userType: ${userType}, userId: ${userId}, socketId: ${socket.id}`);

      try {
        if (userType === 'user') {
          const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { socketID: socket.id },
            { new: true }
          );
          console.log(`[Socket] 👤 Updated user: ${JSON.stringify(updatedUser)}`);
        } else if (userType === 'captain') {
          const updatedCaptain = await captainModel.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { new: true }
          );
          console.log(`[Socket] 🚖 Updated captain: ${JSON.stringify(updatedCaptain)}`);
        } else {
          console.warn(`[Socket] ❗ Unknown userType received: ${userType}`);
        }
      } catch (err) {
        console.error(`[Socket] ❌ Error updating socket ID:`, err);
      }
    });

    connectedSockets.set(socket.id, socket);
    console.log(`[Socket] 🗂️ Added to connectedSockets map: ${socket.id}`);

    // ✅ Location update for captain
   socket.on('update-location-captain', async (data) => {
  const { userId, location } = data;
  

  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return socket.emit('error', { message: 'Invalid location' });
  }

  try {
    const updated = await captainModel.findByIdAndUpdate(
      userId,
      {
        location: {
          type: 'Point',
          coordinates: [location.lat, location.lat] // [lng, lat]
        }
      },
      { new: true }
    );

    if (!updated) {
      console.warn(`[Socket] ⚠️ Captain not found for location update: ${userId}`);
    } else {
      console.log(`[Socket] 📍 Location updated for captain ${userId}:`, updated.location);
    }
  } catch (err) {
    console.error(`[Socket] ❌ Error updating location:`, err);
  }
});


    // ✅ Socket ID update (optional if already handled in 'json' event)
    socket.on("update-captain-socket-id", async ({ captainId, socketId }) => {
  try {
    await captainModel.findByIdAndUpdate(captainId, { socketId });
    console.log(`✅ Captain ${captainId} updated with socketId ${socketId}`);
  } catch (err) {
    console.error("❌ Error updating socketId:", err);
  }
});
    // ✅ On disconnect
    socket.on('disconnect', async () => {
      console.log(`[Socket] 🔌 Disconnected: ${socket.id}`);
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

        console.log(`[Socket] 🔧 Disconnect cleanup: user=${!!userResult}, captain=${!!captainResult}`);
      } catch (err) {
        console.error(`[Socket] ❌ Error during disconnect cleanup:`, err);
      }
    });

    // ✅ Chat message between sockets
    socket.on('chat-message', ({ toSocketId, message }) => {
      console.log(`[Socket] 💬 Chat from ${socket.id} to ${toSocketId}:`, message);
      sendMessage(toSocketId, 'chat-message', {
        from: socket.id,
        message
      });
    });
  });
}

// Helper to send message to a specific socket
function sendMessage(toSocketId, messageObject) {
  if (!io) {
    console.error('[Socket] ❌ Socket.IO not initialized');
    return;
  }

  const socket = connectedSockets.get(toSocketId);

  if (socket) {
    console.log(`[Socket] 📤 Emitting '${messageObject}' to ${toSocketId}`);
    socket.emit(messageObject.event, messageObject.data);
  } else {
    console.warn(`[Socket] ⚠️ Could not find socket with ID: ${toSocketId}`);
  }
}

module.exports = {
  initializeSocket,
  sendMessage
};
