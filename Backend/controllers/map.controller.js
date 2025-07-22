 const mapService = require('../services/map.service');
const { validationResult } = require('express-validator');

 module.exports.getCoordinates = async (req, res) => {
    const { address } = req.query;

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
}
console.log("✅ map.controller.js loaded");