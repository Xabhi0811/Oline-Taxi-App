const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { io: client } = require('socket.io-client');
const axios = require('axios');

function event(socket, name) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { socket.off(name, receive); reject(new Error('Timed out waiting for ' + name)); }, 5000);
    function receive(data) { clearTimeout(timer); resolve(data); }
    socket.once(name, receive);
  });
}
function privateFieldsAbsent(value, allowOtp = false) {
  for (const [key, child] of Object.entries(value || {})) {
    assert.ok(!['password', 'email', 'socketID', 'socketId', 'offeredCaptains', 'paymentID', 'signature', 'location'].includes(key), 'Private field present: ' + key);
    if (!allowOtp) assert.ok(!/otp/i.test(key), 'OTP must not reach captain');
    if (child && typeof child === 'object') privateFieldsAbsent(child, allowOtp);
  }
}

test('disposable MongoDB HTTP and Socket.IO rider/captain journey', { timeout: 180000 }, async t => {
  // Never load or connect to the configured database; use a fresh local mongod.
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.DOTENV_CONFIG_QUIET = 'true';
  process.env.GOOGLE_MAPS_API = 'disposable-test-key';
  const mongo = await MongoMemoryServer.create();
  process.env.DB_CONNECT = mongo.getUri('ride_security_test');
  await mongoose.connect(process.env.DB_CONNECT);
  const originalGet = axios.get;
  const originalPost = axios.post;
  let mapsMode = 'ok';
  let mapCalls = 0;
  const mockMaps = async (url, config) => {
    mapCalls++;
    assert.equal(config.timeout, 5000);
    assert.equal(config.maxRedirects, 0);
    assert.equal(config.maxContentLength, 1048576);
    assert.ok(config.signal instanceof AbortSignal);
    if (mapsMode === 'timeout') throw new Error('private upstream config must not escape');
    if (mapsMode === 'bad') return { data: { status: 'OK', results: [], malformed: true } };
    if (mapsMode === 'zero') return { data: url.includes('geocode') ? { status: 'ZERO_RESULTS' } : {} };
    if (url.includes('geocode')) return { data: { status: 'OK', results: [{ geometry: { location: { lat: 12, lng: 77 } } }] } };
    if (url.includes('computeRoutes')) return { data: { routes: [{ distanceMeters: 2000, duration: '600s' }] } };
    return { data: { suggestions: [{ placePrediction: { text: { text: 'Test pickup' }, placeId: 'test-place' } }] } };
  };
  axios.get = mockMaps;
  axios.post = (url, body, config) => mockMaps(url, config);
  t.after(() => { axios.get = originalGet; axios.post = originalPost; });
  const app = require('../app');
  const { initializeSocket } = require('../socket');
  const Ride = require('../models/ride.module');
  const Captain = require('../models/captain.module');
  const User = require('../models/user.model');
  const server = http.createServer(app);
  const io = initializeSocket(server);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  async function api(path, token, body, expected = 200) {
    const response = await fetch(base + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10000),
    });
    assert.equal(response.status, expected, path + ' status');
    return response.status === 404 ? null : response.json();
  }
  const sockets = [];
  t.after(async () => {
    sockets.forEach(s => s.disconnect());
    await new Promise(resolve => io.close(resolve));
    // Disconnect handlers write asynchronously; keep Mongo alive until they finish.
    const deadline = Date.now() + 3000;
    while (await User.exists({ socketID: { $nin: [null, ''] } }) || await Captain.exists({ socketId: { $ne: null } })) {
      if (Date.now() > deadline) break;
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    await mongoose.disconnect();
    await mongo.stop();
  });
  async function socket(token, role) {
    const s = client(base, { auth: { token, role }, transports: ['websocket'], autoConnect: false, reconnection: false });
    sockets.push(s);
    const ready = event(s, 'ready');
    s.connect();
    await ready;
    return s;
  }
  const password = crypto.randomBytes(18).toString('hex');
  let rider, stranger, c1, c2, outsider, bike, rs, s1, s2, booking, accepted, winner, loser;
  await t.test('signup and login for rider and captains', async () => {
    async function user(email) {
      await api('/users/register', null, { fullName: { firstName: 'Test', lastName: 'Rider' }, email, password }, 201);
      return api('/users/login', null, { email, password });
    }
    async function captain(email, vehicleType = 'car') {
      await api('/captains/register', null, { fullname: { firstname: 'Test', lastname: 'Captain' }, email, password,
        vehicle: { color: 'black', plate: 'TEST123', capacity: 4, vehicleType } }, 201);
      return api('/captains/login', null, { email, password });
    }
    rider = await user('rider@example.com'); stranger = await user('other@example.com');
    c1 = await captain('one@example.com'); c2 = await captain('two@example.com');
    outsider = await captain('out@example.com'); bike = await captain('bike@example.com', 'bike');
    assert.ok(!rider.user.password && !c1.captain.password, 'Authentication responses exclude password hashes');
    rs = await socket(rider.token, 'user'); s1 = await socket(c1.token, 'captain'); s2 = await socket(c2.token, 'captain');
    for (const s of [s1, s2]) {
      const ack = await s.timeout(5000).emitWithAck('update-location-captain', { location: { lat: 12, lng: 77 } });
      assert.equal(ack.ok, true);
    }
  });
  await t.test('offer eligibility rejects stale, distant and disconnected captains', async () => {
    const maps = require('../services/map.service');
    await Captain.updateOne({ _id: c1.captain._id }, { $set: { locationUpdatedAt: new Date(0) } });
    await Captain.updateOne({ _id: c2.captain._id }, { $set: { 'location.coordinates': [0, 0] } });
    assert.equal((await maps.getCaptainInTheRadius(12, 77, 5)).length, 0);
    for (const c of [c1, c2]) await Captain.updateOne({ _id: c.captain._id }, {
      $set: { locationUpdatedAt: new Date(), 'location.coordinates': [77, 12] }
    });
    assert.equal((await maps.getCaptainInTheRadius(12, 77, 5)).length, 2);
  });
  await t.test('fare, booking and minimal new-ride notification', async () => {
    assert.deepEqual((await api('/rides/get-fare?pickup=Test&destination=Other', rider.token)).fare, { auto: 50, car: 110, bike: 25 });
    const offer1 = event(s1, 'new-ride'); const offer2 = event(s2, 'new-ride');
    booking = await api('/rides/create', rider.token, { pickup: 'Test pickup', destination: 'Test destination', vehicleType: 'car' }, 201);
    assert.ok(/^\d{6}$/.test(booking.Otp), 'Rider can view OTP');
    for (const offer of await Promise.all([offer1, offer2])) {
      assert.deepEqual(Object.keys(offer).sort(), ['_id', 'destination', 'fare', 'pickup', 'user']);
      assert.deepEqual(Object.keys(offer.user), ['fullname']);
      privateFieldsAbsent(offer);
    }
    const stored = await Ride.findById(booking._id).select('+offeredCaptains');
    assert.equal(stored.offeredCaptains.length, 2);
  });
  await t.test('unoffered, wrong-vehicle and competing acceptance; role-specific DTO regression', async () => {
    await api('/rides/confirm', outsider.token, { rideId: booking._id }, 409);
    // Even a persisted offer cannot authorize the wrong current vehicle type.
    await Ride.updateOne({ _id: booking._id }, { $push: { offeredCaptains: bike.captain._id } });
    await api('/rides/confirm', bike.token, { rideId: booking._id }, 409);
    const confirmed = event(rs, 'ride-confirmed');
    let captainConfirmationCount = 0;
    for (const s of [s1, s2]) s.on('ride-confirmed', () => captainConfirmationCount++);
    const results = await Promise.all([c1, c2].map(async c => {
      const response = await fetch(base + '/rides/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + c.token }, body: JSON.stringify({ rideId: booking._id }) });
      return { c, status: response.status, data: await response.json() };
    }));
    assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
    winner = results.find(r => r.status === 200).c; loser = results.find(r => r.status === 409).c;
    accepted = results.find(r => r.status === 200).data;
    privateFieldsAbsent(accepted);
    assert.ok(!JSON.stringify(accepted).includes(booking.Otp), 'Captain HTTP response excludes OTP value');
    const riderNotification = await confirmed;
    privateFieldsAbsent(riderNotification, true);
    assert.ok(riderNotification.Otp === booking.Otp, 'Rider-only confirmation retains OTP');
    // Round trips act as delivery barriers before asserting no captain event arrived.
    for (const s of [s1, s2]) await s.timeout(5000).emitWithAck('update-location-captain', { location: { lat: 12, lng: 77 } });
    assert.equal(captainConfirmationCount, 0);
    privateFieldsAbsent(await api('/rides/captain/' + booking._id, winner.token));
    assert.ok((await api('/rides/user/' + booking._id, rider.token)).Otp === booking.Otp);
    const available = await require('../services/map.service').getCaptainInTheRadius(12, 77, 5);
    assert.ok(!available.some(c => String(c._id) === winner.captain._id), 'Busy captain receives no new offers');
  });
  await t.test('unauthorized access and spoofed socket identities', async () => {
    await api('/rides/user/' + booking._id, stranger.token, undefined, 404);
    await api('/rides/captain/' + booking._id, loser.token, undefined, 404);
    await api('/rides/captain/' + booking._id, rider.token, undefined, 401);
    await api('/rides/user/' + booking._id, winner.token, undefined, 401);
    await api('/rides/get-fare?pickup=Test&destination=Other', null, undefined, 401);
    const rejected = client(base, { auth: { token: 'invalid', role: 'captain' }, autoConnect: false, reconnection: false });
    sockets.push(rejected); const error = event(rejected, 'connect_error'); rejected.connect();
    assert.equal((await error).message, 'Unauthorized');
    assert.ok((await rs.timeout(5000).emitWithAck('update-location-captain', { userId: c1.captain._id, location: { lat: 0, lng: 0 } })).error);
    await s1.timeout(5000).emitWithAck('update-location-captain', { userId: outsider.captain._id, location: { lat: 13, lng: 78 } });
    assert.deepEqual((await Captain.findById(outsider.captain._id)).location.coordinates, [0, 0]);
  });
  await t.test('reconnect restores socket identity and rider OTP retrieval', async () => {
    const oldId = rs.id; rs.disconnect();
    const ready = event(rs, 'ready'); rs.connect(); await ready;
    assert.notEqual(rs.id, oldId);
    assert.equal((await User.findById(rider.user._id)).socketID, rs.id);
    assert.ok((await api('/rides/user/' + booking._id, rider.token)).Otp === booking.Otp);
  });
  await t.test('OTP start, wrong captain, completion and replay rejection', async () => {
    const invalid = await api('/rides/start', winner.token, { rideId: booking._id, otp: 'invalid-input' }, 400);
    assert.equal(invalid.message, 'Please check the submitted details');
    await api('/rides/start', loser.token, { rideId: booking._id, otp: booking.Otp }, 409);
    const wrongOtp = booking.Otp === '000000' ? '000001' : '000000';
    await api('/rides/start', winner.token, { rideId: booking._id, otp: wrongOtp }, 409);
    await api('/rides/end', winner.token, { rideId: booking._id }, 409);
    const started = event(rs, 'ride-started');
    privateFieldsAbsent(await api('/rides/start', winner.token, { rideId: booking._id, otp: booking.Otp }));
    assert.equal((await started).status, 'ongoing');
    await api('/rides/start', winner.token, { rideId: booking._id, otp: booking.Otp }, 409);
    await api('/rides/end', loser.token, { rideId: booking._id }, 409);
    const ended = event(rs, 'ride-ended');
    privateFieldsAbsent(await api('/rides/end', winner.token, { rideId: booking._id }));
    assert.equal((await ended).status, 'completed');
    await api('/rides/end', winner.token, { rideId: booking._id }, 409);
    assert.equal((await Ride.findById(booking._id)).status, 'completed');
    privateFieldsAbsent(await api('/rides/user/' + booking._id, rider.token));
  });
  await t.test('Maps failure validation and no orphan booking', async () => {
    for (const mode of ['bad', 'timeout']) {
      mapsMode = mode;
      const count = await Ride.countDocuments();
      await api('/rides/create', rider.token, { pickup: 'Test pickup', destination: 'Test destination', vehicleType: 'car' }, 502);
      assert.equal(await Ride.countDocuments(), count);
      for (const path of ['/map/get-coordinates?address=Test', '/map/get-distance-time?origin=Test&destination=Other', '/map/get-suggestions?input=Test']) {
        const data = await api(path, rider.token, undefined, 502);
        assert.equal(data.message, 'Maps service unavailable. Please try again.');
      }
    }
    mapsMode = 'zero';
    assert.deepEqual(await api('/map/get-suggestions?input=Test', rider.token), { suggestions: [] });
    await api('/map/get-coordinates?address=Test', rider.token, undefined, 422);
    mapsMode = 'ok';
    const before = mapCalls;
    await api('/map/get-coordinates?address=x', rider.token, undefined, 400);
    await api('/map/get-coordinates?address=' + 'x'.repeat(301), rider.token, undefined, 400);
    assert.equal(mapCalls, before);
  });
  await t.test('login and shared Maps limits return 429 and Retry-After', async () => {
    let status = 0;
    for (let i = 0; i < 21 && status !== 429; i++) {
      const response = await fetch(base + '/users/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      status = response.status;
      if (status === 429) assert.ok(response.headers.get('retry-after'));
      await response.text();
    }
    assert.equal(status, 429);
    status = 0;
    for (let i = 0; i < 61 && status !== 429; i++) {
      const response = await fetch(base + '/map/get-suggestions?input=Test', { headers: { Authorization: 'Bearer ' + rider.token } });
      status = response.status; await response.text();
    }
    assert.equal(status, 429);
    const before = mapCalls;
    await api('/rides/get-fare?pickup=Test&destination=Other', rider.token, undefined, 429);
    assert.equal(mapCalls, before);
  });
  await t.test('real server.js startup and health with disposable database', async () => {
    const child = spawn(process.execPath, ['server.js'], { cwd: require('node:path').join(__dirname, '..'),
      env: { ...process.env, PORT: '0' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    t.after(() => child.kill());
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Startup timed out')), 15000);
      child.stdout.on('data', chunk => { const match = String(chunk).match(/port (\d+)/); if (match) { clearTimeout(timer); resolve(match[1]); } });
      child.once('exit', () => { clearTimeout(timer); reject(new Error('Server exited before ready')); });
    });
    const response = await fetch('http://127.0.0.1:' + port + '/health');
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, 'ready');
    child.kill();
  });
});
