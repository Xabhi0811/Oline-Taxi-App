const axios = require('axios');
const Captain = require('../models/captain.module');
async function request(endpoint, params) {
  try {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/' + endpoint + '/json', {
      params: { ...params, key: process.env.GOOGLE_MAPS_API },
      timeout: 5000, signal: AbortSignal.timeout(6000),
      maxContentLength: 1024 * 1024, maxRedirects: 0,
    });
    if (!data || !['OK', 'ZERO_RESULTS'].includes(data.status)) throw new Error();
    return data;
  } catch {
    // Axios errors contain credentials and locations; never expose their config.
    throw new Error('Maps service unavailable');
  }
}
exports.getAddressCoordinates = async address => {
  const data = await request('geocode', { address });
  if (data.status === 'ZERO_RESULTS') return null;
  const loc = data.results?.[0]?.geometry?.location;
  if (!Number.isFinite(loc?.lat) || Math.abs(loc.lat) > 90 ||
      !Number.isFinite(loc?.lng) || Math.abs(loc.lng) > 180) throw new Error('Invalid Maps coordinates');
  return { lat: loc.lat, lng: loc.lng };
};
exports.getDistanceTime = async (origin, destination) => {
  const data = await request('distancematrix', { origins: origin, destinations: destination });
  const el = data.rows?.[0]?.elements?.[0];
  if (data.status === 'ZERO_RESULTS' || el?.status === 'ZERO_RESULTS') return null;
  if (el?.status !== 'OK' || !Number.isFinite(el.distance?.value) || el.distance.value < 0 ||
      !Number.isFinite(el.duration?.value) || el.duration.value < 0) throw new Error('Invalid Maps route');
  return { distance: { value: el.distance.value }, duration: { value: el.duration.value } };
};
exports.getAutoCompleteSuggestions = async input => {
  const data = await request('place/autocomplete', { input });
  if (data.status === 'ZERO_RESULTS') return [];
  if (!Array.isArray(data.predictions) || data.predictions.some(p =>
    typeof p?.description !== 'string' || typeof p?.place_id !== 'string')) throw new Error('Invalid Maps suggestions');
  return data.predictions.slice(0, 10).map(({ description, place_id }) => ({ description, place_id }));
};
// Offers require a connected captain, a location reported within five minutes,
// proximity to pickup, and no accepted/ongoing ride at offer time.
exports.getCaptainInTheRadius = async (lat, lng, radius) => {
  const Ride = require('../models/ride.module');
  const busy = await Ride.distinct('captain', { status: { $in: ['accepted', 'ongoing'] } });
  return Captain.find({
    _id: { $nin: busy }, socketId: { $ne: null },
    locationUpdatedAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius / 6371] } },
  }).select('_id socketId vehicle');
};
