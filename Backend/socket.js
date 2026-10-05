const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.module');
const blacklistTokenModel = require('./models/blacklistToken.model');

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: { origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.FRONTEND_URL].filter(Boolean), credentials: true }
  });
  io.use(async (socket, next) => {
    try {
      const { token, role } = socket.handshake.auth || {};
      if (!token || !['user', 'captain'].includes(role)) throw new Error('Unauthorized');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (await blacklistTokenModel.exists({ token })) throw new Error('Unauthorized');
      const model = role === 'captain' ? captainModel : userModel;
      if (!await model.exists({ _id: decoded._id })) throw new Error('Unauthorized');
      socket.data.identity = { id: decoded._id, role };
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });
  io.on('connection', async (socket) => {
    const { id, role } = socket.data.identity;
    const model = role === 'captain' ? captainModel : userModel;
    const field = role === 'captain' ? 'socketId' : 'socketID';
    socket.on('update-location-captain', async (data = {}, acknowledge = () => {}) => {
      const { location } = data;
      if (role !== 'captain' || !Number.isFinite(location?.lat) || !Number.isFinite(location?.lng) ||
          Math.abs(location.lat) > 90 || Math.abs(location.lng) > 180) {
        return acknowledge({ error: 'Invalid location or role' });
      }
      try {
        await captainModel.updateOne({ _id: id }, {
          $set: { location: { type: 'Point', coordinates: [location.lng, location.lat] } }
        });
        acknowledge({ ok: true });
      } catch {
        acknowledge({ error: 'Unable to update location' });
      }
    });
    socket.on('disconnect', async () => {
      try {
        await model.updateOne({ _id: id, [field]: socket.id }, { $set: { [field]: null } });
      } catch {
        console.error('Socket cleanup failed');
      }
    });
    try {
      await model.updateOne({ _id: id }, { $set: { [field]: socket.id } });
      if (socket.connected) socket.emit('ready');
      else await model.updateOne({ _id: id, [field]: socket.id }, { $set: { [field]: null } });
    } catch {
      socket.disconnect(true);
    }
  });
  return io;
}

function sendMessage(socketId, { event, data }) {
  if (io && socketId) io.to(socketId).emit(event, data);
}

module.exports = { initializeSocket, sendMessage };
