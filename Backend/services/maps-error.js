const messages = {
  MAPS_BILLING_REQUIRED: 'Location search and fares are unavailable until the app owner enables Maps billing.',
  MAPS_CONFIGURATION: 'Location services need to be enabled by the app owner. Please try again after setup is complete.',
  MAPS_KEY_RESTRICTION: 'Location services are blocked by the app\'s Maps key settings. Please contact the app owner.',
  MAPS_QUOTA: 'Location services are busy. Please try again later.',
  MAPS_TIMEOUT: 'Location services took too long to respond. Please try again.',
  MAPS_UNAVAILABLE: 'Maps service unavailable. Please try again.',
};

class MapsError extends Error {
  constructor(code = 'MAPS_UNAVAILABLE') {
    super(messages[code]);
    this.code = code;
    this.status = code === 'MAPS_TIMEOUT' ? 504 : code === 'MAPS_UNAVAILABLE' ? 502 : 503;
  }
}

function providerError(data, httpStatus, transportCode) {
  // Inspect locally, but never return/log Google's text or Axios request config.
  const description = String(data?.error_message || data?.error?.message || '').toLowerCase();
  const reasons = (Array.isArray(data?.error?.details) ? data.error.details : []).map(d => d?.reason || '').join(' ').toLowerCase();
  const status = data?.status || data?.error?.status;
  if (/billing/.test(description + reasons)) return new MapsError('MAPS_BILLING_REQUIRED');
  if (/api_key_.*blocked/.test(reasons)) return new MapsError('MAPS_KEY_RESTRICTION');
  if (['OVER_QUERY_LIMIT', 'OVER_DAILY_LIMIT', 'RESOURCE_EXHAUSTED'].includes(status) || httpStatus === 429) return new MapsError('MAPS_QUOTA');
  if (['REQUEST_DENIED', 'PERMISSION_DENIED', 'UNAUTHENTICATED'].includes(status) || [401, 403].includes(httpStatus)) return new MapsError('MAPS_CONFIGURATION');
  if (['ECONNABORTED', 'ERR_CANCELED', 'ETIMEDOUT'].includes(transportCode)) return new MapsError('MAPS_TIMEOUT');
  return new MapsError();
}

function errorResponse(error, fallback) {
  return error instanceof MapsError
    ? { status: error.status, body: { message: error.message, code: error.code } }
    : { status: 502, body: { message: fallback } };
}

module.exports = { MapsError, providerError, errorResponse };
