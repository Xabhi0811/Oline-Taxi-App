const mapService = require('../services/map.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
    const { address } = req.query;
    console.log("Received address:", address);

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    try {
        const coordinates = await mapService.getAddressCoordinates(address);
        if (!coordinates) {
            return res.status(404).json({ error: 'Coordinates not found for the given address' });
        }
        res.json(coordinates);
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports.getDistanceTime = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;
        console.log("Origin:", origin, "Destination:", destination);

        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.json(distanceTime);

    } catch (error) {
        console.error('Error fetching distance and time:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports.getAutoCompleteSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;
        console.log("Input for suggestions:", input);

        if (!input) {
            return res.status(400).json({ error: 'Input is required for autocomplete suggestions' });
        }

        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        console.log("Suggestions from API:", suggestions); // ✅ Moved inside try block
        res.json({ suggestions });

    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

console.log("✅ map.controller.js loaded");
