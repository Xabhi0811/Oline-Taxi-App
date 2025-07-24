const MapService = require('../services/map.service'); // assuming MapService is defined
// You may need to change this import based on your structure

async function getFare(pickup, destination, vehicleType = 'auto') {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await MapService.getDistanceTime(pickup, destination);

    const distanceInKm = distanceTime.distance / 1000; // assuming distance is in meters
    const durationInMin = distanceTime.duration / 60; // assuming duration is in seconds

    let fare = 0;

    if (vehicleType === 'auto') {
        const baseFare = 30;
        const perKmFare = 12;
        const perMinFare = 1;

        if (distanceInKm <= 2) {
            fare = baseFare;
        } else {
            fare = baseFare + (distanceInKm - 2) * perKmFare;
        }

        fare += durationInMin * perMinFare;

    } else if (vehicleType === 'moto') {
        const baseFare = 20;
        const perKmFare = 8;
        const perMinFare = 0.5;

        if (distanceInKm <= 2) {
            fare = baseFare;
        } else {
            fare = baseFare + (distanceInKm - 2) * perKmFare;
        }

        fare += durationInMin * perMinFare;
    } else {
        throw new Error('Invalid vehicle type. Supported: auto, moto');
    }

    return Math.round(fare); // optional rounding
}
