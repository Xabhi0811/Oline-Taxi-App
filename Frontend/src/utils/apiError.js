export function apiError(error, fallback = 'The request failed. Please try again.') {
  const data = error.response?.data;
  const details = data?.errors || data?.error;
  if (Array.isArray(details)) return details.map(item => item.msg).join('. ');
  if (typeof details === 'string') return details;
  return data?.message || fallback;
}
