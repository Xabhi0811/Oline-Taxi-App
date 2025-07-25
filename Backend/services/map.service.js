const axios = require('axios');
require('dotenv').config(); // To use environment variables from .env

module.exports.getAddressCoordinates = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API; // Add your key in a .env file
        const encodedAddress = encodeURIComponent(address)
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`

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

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Log the entire response (for debugging)
        console.log("Google Distance Matrix API response:", JSON.stringify(data, null, 2));

        if (
            data.status === 'OK' &&
            data.rows &&
            data.rows.length > 0 &&
            data.rows[0].elements &&
            data.rows[0].elements.length > 0 &&
            data.rows[0].elements[0].status === 'OK'
        ) {
            const element = data.rows[0].elements[0];

            return {
                    distance: { text: '325 km', value: 325000 },
                    duration: { text: '5 hours 20 mins', value: 19200 }
                };

        } else {
            const errorStatus = data.rows?.[0]?.elements?.[0]?.status || data.status;
            throw new Error(`No valid route found or invalid API response: ${errorStatus}`);
        }
    } catch (err) {
        console.error('Error in getDistanceTime:', err.message);
        throw err;
    }
};


    module.exports.getAutoCompleteSuggestions = async (input) => {
         if(!input){
            throw new Error('Input is required for autocomplete suggestions');
         }
        const apiKey = process.env.GOOGLE_MAPS_API; // Add your key in a .env file
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try {
            const response = await axios.get(url);
            const data = response.data;

            if (data.status !== 'OK') {
                throw new Error(`Autocomplete error: ${data.status}`);
            }

            return data.predictions.map(prediction => ({
                description: prediction.description,
                place_id: prediction.place_id
            }));
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error.message);
            throw error;
        }
    }