const { test } = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const maps = require('../services/map.service');
const { MapsError, errorResponse } = require('../services/maps-error');
process.env.GOOGLE_MAPS_API = 'test-only-fixture';

test('modern Places and Routes APIs preserve the frontend response contract', async t => {
  t.mock.method(axios, 'post', async (url, body, config) => {
    assert.equal(config.timeout, 5000);
    assert.equal(config.maxRedirects, 0);
    assert.equal(config.maxContentLength, 1048576);
    assert.ok(config.signal instanceof AbortSignal);
    assert.ok(config.headers['X-Goog-Api-Key']);
    if (url === 'https://places.googleapis.com/v1/places:autocomplete') {
      assert.equal(body.input, 'Test');
      assert.equal(config.headers['X-Goog-FieldMask'], 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text');
      return { data: { suggestions: [{ placePrediction: { placeId: 'fixture', text: { text: 'Test location' } } }] } };
    }
    assert.equal(url, 'https://routes.googleapis.com/directions/v2:computeRoutes');
    assert.deepEqual(body.origin, { address: 'Start' });
    assert.equal(config.headers['X-Goog-FieldMask'], 'routes.distanceMeters,routes.duration');
    return { data: { routes: [{ distanceMeters: 2000, duration: '600.5s' }] } };
  });
  assert.deepEqual(await maps.getAutoCompleteSuggestions('Test'), [{ description: 'Test location', place_id: 'fixture' }]);
  assert.deepEqual(await maps.getDistanceTime('Start', 'End'), { distance: { value: 2000 }, duration: { value: 600.5 } });
});

test('billing and key restriction errors are actionable without exposing upstream data', async t => {
  t.mock.method(axios, 'get', async () => ({ data: { status: 'REQUEST_DENIED', error_message: 'Enable billing; private upstream content' } }));
  await assert.rejects(maps.getAddressCoordinates('Test'), error => {
    const response = errorResponse(error);
    assert.equal(response.status, 503);
    assert.equal(response.body.code, 'MAPS_BILLING_REQUIRED');
    assert.ok(!JSON.stringify(response).includes('private upstream content'));
    return true;
  });
  t.mock.method(axios, 'post', async () => { throw { response: { status: 403, data: { error: {
    status: 'PERMISSION_DENIED', message: 'private upstream content', details: [{ reason: 'API_KEY_SERVICE_BLOCKED' }],
  } } } }; });
  await assert.rejects(maps.getAutoCompleteSuggestions('Test'), { code: 'MAPS_KEY_RESTRICTION' });
  await assert.rejects(maps.getDistanceTime('Start', 'End'), { code: 'MAPS_KEY_RESTRICTION' });
});

test('empty results, malformed responses and timeouts are distinguished', async t => {
  const mock = t.mock.method(axios, 'post', async () => ({ data: {} }));
  assert.deepEqual(await maps.getAutoCompleteSuggestions('Test'), []);
  assert.equal(await maps.getDistanceTime('Start', 'End'), null);
  mock.mock.mockImplementation(async () => ({ data: { suggestions: [{ placePrediction: { placeId: 'id' } }] } }));
  await assert.rejects(maps.getAutoCompleteSuggestions('Test'), MapsError);
  mock.mock.mockImplementation(async () => ({ data: { routes: [{ distanceMeters: -1, duration: 'bad' }] } }));
  await assert.rejects(maps.getDistanceTime('Start', 'End'), MapsError);
  mock.mock.mockImplementation(async () => { throw { code: 'ECONNABORTED' }; });
  await assert.rejects(maps.getAutoCompleteSuggestions('Test'), { code: 'MAPS_TIMEOUT', status: 504 });
});
