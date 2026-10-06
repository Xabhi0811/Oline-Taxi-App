const maps = require('../services/map.service');
const { validationResult } = require('express-validator');
function handle(operation) {
  return async (req, res) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ message: 'Invalid location input' });
    try {
      const data = await operation(req.query);
      if (data === null) return res.status(422).json({ message: 'Location or route not found' });
      res.json(data);
    } catch {
      res.status(502).json({ message: 'Maps service unavailable. Please try again.' });
    }
  };
}
exports.getCoordinates = handle(q => maps.getAddressCoordinates(q.address));
exports.getDistanceTime = handle(q => maps.getDistanceTime(q.origin, q.destination));
exports.getAutoCompleteSuggestions = handle(async q => ({ suggestions: await maps.getAutoCompleteSuggestions(q.input) }));
