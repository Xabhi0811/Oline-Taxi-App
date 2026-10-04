const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const mapService = require('../services/map.service');
const { getFare } = require('../services/fare.util');
const Ride = require('../models/ride.module');
const rideService = require('../services/ride.service');

test('fare calculation returns a price for each vehicle type', async () => {
  const original = mapService.getDistanceTime;
  mapService.getDistanceTime = async () => ({
    distance: { value: 2000 },
    duration: { value: 600 },
  });

  try {
    assert.deepEqual(await getFare('A', 'B'), {
      auto: 50,
      car: 110,
      bike: 25,
    });
  } finally {
    mapService.getDistanceTime = original;
  }
});

test('ride requires a supported vehicle type', () => {
  const ride = new Ride({
    user: new mongoose.Types.ObjectId(),
    pickup: 'A',
    destination: 'B',
    fare: 50,
    Otp: '123456',
    vehicleType: 'truck',
  });
  assert.ok(ride.validateSync()?.errors.vehicleType);
  ride.vehicleType = 'auto';
  assert.equal(ride.validateSync(), undefined);
});

test('confirm only accepts a pending ride', async () => {
  const original = Ride.findOneAndUpdate;
  let filter;
  Ride.findOneAndUpdate = (query, update, options) => {
    filter = query;
    assert.equal(update.$set.status, 'accepted');
    assert.equal(options.new, true);
    return {
      populate() { return this; },
      select() { return { status: 'accepted' }; },
    };
  };
  try {
    await rideService.confirmRide({ rideId: 'ride-1', captain: 'captain-1' });
    assert.deepEqual(filter, { _id: 'ride-1', status: 'pending' });
  } finally {
    Ride.findOneAndUpdate = original;
  }
});

test('start requires matching captain, accepted status, and OTP', async () => {
  const original = Ride.findOneAndUpdate;
  let filter;
  Ride.findOneAndUpdate = (query, update, options) => {
    filter = query;
    assert.equal(update.$set.status, 'ongoing');
    assert.equal(options.new, true);
    return {
      populate() { return this; },
      select() { return { status: 'ongoing' }; },
    };
  };
  try {
    await rideService.startRide({ rideId: 'ride-1', otp: '123456', captain: { _id: 'captain-1' } });
    assert.deepEqual(filter, {
      _id: 'ride-1',
      captain: 'captain-1',
      status: 'accepted',
      Otp: '123456',
    });
  } finally {
    Ride.findOneAndUpdate = original;
  }
});
