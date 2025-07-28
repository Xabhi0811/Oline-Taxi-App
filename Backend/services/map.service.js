const axios = require('axios');
require('dotenv').config(); // To use environment variables from .env
const captainModel = require('../models/captain.module')

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
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    console.log("📦 Google API response:", JSON.stringify(data, null, 2));

    const element = data?.rows?.[0]?.elements?.[0];

    // ✅ Handle ZERO_RESULTS gracefully
    if (data.status === 'OK') {
      if (element?.status === 'OK') {
        return {
          distance: element.distance,
          duration: element.duration
        };
      } else if (element?.status === 'ZERO_RESULTS') {
        console.warn("⚠️ No route found between origin and destination.");
        return null; // Signal that no route could be found
      }
    }

    console.error("❌ API status issue:", element?.status, data.status);
    throw new Error(`Google Maps API failed: ${element?.status || 'Invalid response'}`);

  } catch (error) {
    console.error("🚨 Google Maps API error:", error.message);
    throw error;
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


    module.exports.getCaptainInTheRadius = async (ltd , lng , radius) =>{
      const captains = await captainModel.find({
        location :{
          $geoWithin:{
            $centerSphere: [[ltd ,lng] , radius/3963.2]
          }
        }
      })
      return captains
    }