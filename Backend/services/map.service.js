const axios = require('axios');
require('dotenv').config(); // To use environment variables from .env

module.exports.getAddressCoordinates = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API; // Add your key in a .env file
        const encodedAddress = encodeURIComponent(address);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status !== 'OK') {
            throw new Error(`Geocoding error: ${data.status}`);
        }

        const location = data.results[0].geometry.location;
        return {
            lat: location.lat,
            lng: location.lng
        };
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        return null;
    }
};
