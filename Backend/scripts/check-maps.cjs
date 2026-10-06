// Only safe service/result codes are printed; credentials and locations stay private.
require('dotenv').config({ path: require('node:path').join(__dirname, '../.env'), quiet: true });
const maps = require('../services/map.service');
const { MapsError } = require('../services/maps-error');

(async () => {
  for (const [service, check] of [
    ['Autocomplete', () => maps.getAutoCompleteSuggestions('India Gate New Delhi')],
    ['Routes', () => maps.getDistanceTime('India Gate New Delhi', 'Red Fort New Delhi')],
    ['Geocoding', () => maps.getAddressCoordinates('India Gate New Delhi')],
  ]) {
    try {
      const result = await check();
      console.log(service + ': ' + ((Array.isArray(result) ? result.length > 0 : Boolean(result)) ? 'OK' : 'NO_RESULTS'));
    } catch (error) {
      console.log(service + ': ' + (error instanceof MapsError ? error.code : 'CHECK_FAILED'));
      process.exitCode = 1;
    }
  }
})();
