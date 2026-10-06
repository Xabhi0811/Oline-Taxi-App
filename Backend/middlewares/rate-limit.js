const { rateLimit } = require('express-rate-limit');
const options = { standardHeaders: 'draft-8', legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' } };
exports.loginLimit = rateLimit({ ...options, windowMs: 15 * 60 * 1000, limit: 20 });
exports.mapsLimit = rateLimit({ ...options, windowMs: 60 * 1000, limit: 60 });
exports.otpLimit = rateLimit({ ...options, windowMs: 15 * 60 * 1000, limit: 20 });
