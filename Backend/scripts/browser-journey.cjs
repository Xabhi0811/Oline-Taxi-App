// Run from Backend: npm run test:browser. Requires installed Chrome.
const { chromium } = require('playwright');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const assert = require('node:assert/strict');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const crypto = require('node:crypto');

(async () => {
  let mongo, io, vite, browser;
  let stage = 'fixture startup';
  try {
    mongo = await MongoMemoryServer.create();
    process.env.DB_CONNECT = mongo.getUri('browser_journey');
    process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
    const reservation = http.createServer();
    await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
    const frontPort = reservation.address().port;
    await new Promise(resolve => reservation.close(resolve));
    const front = 'http://127.0.0.1:' + frontPort;
    process.env.FRONTEND_URL = front;
    await mongoose.connect(process.env.DB_CONNECT);
    const maps = require('../services/map.service');
    maps.getDistanceTime = async pickup => {
      if (pickup === 'Unavailable route') throw new Error('Simulated Maps outage');
      return { distance: { value: 2000 }, duration: { value: 600 } };
    };
    maps.getAddressCoordinates = async () => ({ lat: 12, lng: 77 });
    maps.getAutoCompleteSuggestions = async input => [{ description: input, place_id: 'fixture' }];
    const api = http.createServer(require('../app'));
    io = require('../socket').initializeSocket(api);
    await new Promise(resolve => api.listen(0, '127.0.0.1', resolve));
    const backend = 'http://127.0.0.1:' + api.address().port;
    const frontendDir = path.resolve(__dirname, '../../Frontend');
    vite = spawn(process.execPath, [path.join(frontendDir, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(frontPort), '--strictPort'], {
      cwd: frontendDir, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, VITE_BACKEND_URL: backend, VITE_SOCKET_URL: backend },
    });
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Vite startup timed out')), 30000);
      vite.stdout.on('data', chunk => { if (String(chunk).includes('Local:')) { clearTimeout(timer); resolve(); } });
      vite.once('exit', () => { clearTimeout(timer); reject(new Error('Vite exited')); });
    });
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const runtimeErrors = [];
    async function page() {
      const context = await browser.newContext({ viewport: { width: 430, height: 932 },
        geolocation: { latitude: 12, longitude: 77 }, permissions: ['geolocation'] });
      const tab = await context.newPage();
      tab.setDefaultTimeout(15000);
      tab.on('pageerror', () => runtimeErrors.push(true));
      // No external images or Maps calls; fixtures and all app traffic stay local.
      await tab.route('**/*', route => ['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
      return tab;
    }
    const rider = await page(); const captain = await page();
    const password = crypto.randomBytes(18).toString('hex');
    stage = 'rider signup';
    await rider.goto(front + '/signup');
    await rider.getByPlaceholder('First name', { exact: true }).fill('Test');
    await rider.getByPlaceholder('Last name', { exact: true }).fill('Rider');
    await rider.getByPlaceholder('email@example.com', { exact: true }).fill('browser-rider@example.com');
    await rider.getByPlaceholder('password', { exact: true }).fill(password);
    await rider.getByRole('button', { name: 'Create account', exact: true }).click();
    await rider.waitForURL('**/home');
    stage = 'captain signup';
    await captain.goto(front + '/captain-Signup');
    await captain.getByPlaceholder('Frist name').fill('Test');
    await captain.getByPlaceholder('last name').fill('Captain');
    await captain.getByPlaceholder('email@example.com').fill('browser-captain@example.com');
    await captain.getByPlaceholder('password', { exact: true }).fill(password);
    await captain.locator('select').selectOption('car');
    await captain.getByPlaceholder('Vehicle plate number').fill('TEST123');
    await captain.getByPlaceholder('Vehicle color').fill('Black');
    await captain.getByPlaceholder('Vehicle capacity').fill('4');
    await captain.getByRole('button', { name: 'Create Captain Account' }).click();
    await captain.waitForURL('**/captain-home');
    console.log('PASS browser rider and captain signup');
    stage = 'rider and captain login';
    for (const [tab, loginPath, email, home] of [
      [rider, '/login', 'browser-rider@example.com', '**/home'],
      [captain, '/captain-login', 'browser-captain@example.com', '**/captain-home'],
    ]) {
      await tab.goto(front + loginPath);
      await tab.getByPlaceholder('email@example.com').fill(email);
      await tab.getByPlaceholder('password', { exact: true }).fill(password);
      await tab.getByRole('button', { name: 'Login', exact: true }).click();
      await tab.waitForURL(home);
    }
    console.log('PASS browser rider and captain login');
    // Observe server-side location readiness instead of sleeping through a socket race.
    const Captain = require('../models/captain.module');
    const deadline = Date.now() + 10000;
    while (!await Captain.exists({ locationUpdatedAt: { $ne: null }, socketId: { $ne: null } })) {
      if (Date.now() > deadline) throw new Error('Location not ready');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    stage = 'fare error and booking';
    await rider.getByRole('button', { name: 'Find Trip', exact: true }).click();
    await rider.getByRole('alert').filter({ hasText: 'pickup and destination' }).waitFor();
    await rider.getByPlaceholder('Add pick-up location').fill('Unavailable route');
    await rider.getByPlaceholder('Enter your destination').fill('Test Destination');
    await rider.getByRole('button', { name: 'Find Trip', exact: true }).click();
    await rider.getByRole('alert').filter({ hasText: 'Unable to calculate fare' }).waitFor();
    await rider.getByPlaceholder('Add pick-up location').fill('Test Pickup');
    await rider.getByRole('button', { name: 'Find Trip', exact: true }).click();
    await rider.getByRole('heading', { name: 'Choose a vehicle' }).waitFor();
    await rider.locator('h2').filter({ hasText: '\u20b9110' }).click();
    await rider.getByRole('button', { name: 'Confirm', exact: true }).click();
    await captain.getByRole('button', { name: 'Accept', exact: true }).click();
    await captain.getByPlaceholder('Enter OTP').waitFor();
    const otpNode = rider.getByRole('heading').filter({ hasText: /^OTP: \d{6}$/ });
    await otpNode.waitFor();
    const otp = (await otpNode.innerText()).match(/\d{6}/)[0];
    console.log('PASS browser fare errors, booking, notification, acceptance and rider OTP');
    stage = 'accepted ride refresh and reconnect';
    await rider.reload(); await captain.reload();
    await otpNode.waitFor(); await captain.getByPlaceholder('Enter OTP').waitFor();
    assert.ok((await otpNode.innerText()).includes(otp), 'Rider OTP survives reload');
    console.log('PASS browser accepted-ride recovery for both roles');
    stage = 'OTP start';
    await captain.getByPlaceholder('Enter OTP').fill('000000');
    await captain.getByRole('button', { name: 'Start Ride', exact: true }).click();
    await captain.getByRole('alert').filter({ hasText: 'OTP is invalid' }).waitFor();
    await captain.getByPlaceholder('Enter OTP').fill(otp);
    await captain.getByRole('button', { name: 'Start Ride', exact: true }).click();
    await captain.waitForURL('**/captain-riding'); await rider.waitForURL('**/riding');
    console.log('PASS browser wrong OTP rejected and correct OTP starts ride');
    stage = 'ongoing recovery and completion';
    await captain.reload(); await rider.reload();
    await captain.getByRole('button', { name: 'Complete Ride', exact: true }).waitFor();
    await rider.getByText('Fare: \u20b9110', { exact: true }).waitFor();
    await captain.getByRole('button', { name: 'Complete Ride', exact: true }).click();
    await captain.getByRole('button', { name: 'Finish Ride', exact: true }).click();
    await captain.waitForURL('**/captain-home');
    await rider.getByRole('heading', { name: 'Ride completed', exact: true }).waitFor();
    console.log('PASS browser ongoing recovery and completion');
    stage = 'unauthenticated browser route';
    const anonymous = await page();
    await anonymous.goto(front + '/captain-home'); await anonymous.waitForURL('**/captain-login');
    assert.equal(runtimeErrors.length, 0, 'No uncaught browser exceptions');
    console.log('PASS browser unauthorized redirect and no uncaught runtime errors');
  } catch {
    // Playwright errors can contain filled values. Report only the safe stage.
    console.error('FAIL browser journey at stage: ' + stage);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (vite) vite.kill();
    if (io) await new Promise(resolve => io.close(resolve));
    if (mongoose.connection.readyState === 1) await mongoose.disconnect();
    if (mongo) await mongo.stop();
  }
})();
