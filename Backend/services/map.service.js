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

    const apiKey = process.env.GOOGLE_MAPS_API; // Add your key in a .env file
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;   
     try {
        const response = await axios.get(url)
        if(response.data.status !== 'OK') {
            
            if(response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No route found between the origin and destination');
            }

            return response.data.rows[0].elements[0];
        } else {
            throw new Error(`Distance Matrix API error: ${response.data.status}`);
        }

     }catch(err){
        console.error(err)
        throw err;
     
    }
    }



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