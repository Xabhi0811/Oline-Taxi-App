const axios = require('axios');
const Captain = require('../models/captain.module');
const { MapsError, providerError } = require('./maps-error');

function options() {
  if (!process.env.GOOGLE_MAPS_API?.trim()) throw new MapsError('MAPS_CONFIGURATION');
  return { timeout: 5000, signal: AbortSignal.timeout(6000), maxContentLength: 1024 * 1024, maxRedirects: 0 };
}
async function geocode(address) {
  try {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      ...options(), params: { address, key: process.env.GOOGLE_MAPS_API },
    });
    if (!data || !['OK', 'ZERO_RESULTS'].includes(data.status)) throw providerError(data);
    return data;
  } catch (error) {
    if (error instanceof MapsError) throw error;
    throw providerError(error.response?.data, error.response?.status, error.code);
  }
}
async function post(url, body, fieldMask) {
  try {
    const { data } = await axios.post(url, body, {
      ...options(), headers: { 'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API, 'X-Goog-FieldMask': fieldMask },
    });
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new MapsError();
    if (data.error) throw providerError(data);
    return data;
  } catch (error) {
    if (error instanceof MapsError) throw error;
    throw providerError(error.response?.data, error.response?.status, error.code);
  }
}
exports.getAddressCoordinates = async address => {
  const data = await geocode(address);
  if (data.status === 'ZERO_RESULTS') return null;
  const loc = data.results?.[0]?.geometry?.location;
  if (!Number.isFinite(loc?.lat) || Math.abs(loc.lat) > 90 ||
      !Number.isFinite(loc?.lng) || Math.abs(loc.lng) > 180) throw new MapsError();
  return { lat: loc.lat, lng: loc.lng };
};
exports.getDistanceTime = async (origin, destination) => {
  const data = await post('https://routes.googleapis.com/directions/v2:computeRoutes', {
    origin: { address: origin }, destination: { address: destination },
    travelMode: 'DRIVE', routingPreference: 'TRAFFIC_UNAWARE',
  }, 'routes.distanceMeters,routes.duration');
  // Google protobuf JSON may omit the routes array when no route exists.
  if (data.routes === undefined && Object.keys(data).length === 0) return null;
  if (!Array.isArray(data.routes)) throw new MapsError();
  if (data.routes.length === 0) return null;
  const route = data.routes[0];
  if (!Number.isFinite(route?.distanceMeters) || route.distanceMeters < 0 ||
      typeof route.duration !== 'string' || !/^\d+(\.\d+)?s$/.test(route.duration)) throw new MapsError();
  const seconds = Number(route.duration.slice(0, -1));
  if (!Number.isFinite(seconds)) throw new MapsError();
  return { distance: { value: route.distanceMeters }, duration: { value: seconds } };
};
exports.getAutoCompleteSuggestions = async input => {
  const data = await post('https://places.googleapis.com/v1/places:autocomplete', {
    input, includeQueryPredictions: false,
  }, 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text');
  if (data.suggestions === undefined && Object.keys(data).length === 0) return [];
  if (!Array.isArray(data.suggestions)) throw new MapsError();
  return data.suggestions.slice(0, 10).map(suggestion => {
    const place = suggestion?.placePrediction;
    if (typeof place?.placeId !== 'string' || typeof place.text?.text !== 'string') throw new MapsError();
    return { description: place.text.text, place_id: place.placeId };
  });
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
