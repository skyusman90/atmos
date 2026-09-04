export class ApiError extends Error {
  constructor(message, { type = 'unknown', status = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
  }
}

export function getErrorMessage(error) {
  if (error?.name === 'AbortError') {
    return null;
  }

  if (error instanceof ApiError) {
    if (error.type === 'network') {
      return "You appear to be offline. Check your connection and try again.";
    }
    if (error.type === 'http' && error.status >= 500) {
      return 'The weather service is temporarily unavailable. Please try again shortly.';
    }
    if (error.type === 'http' && error.status === 404) {
      return 'No data found for this location.';
    }
    if (error.type === 'http') {
      return `Request failed (${error.status}). Please try again.`;
    }
    if (error.type === 'validation') {
      return 'Received unexpected data from the server.';
    }
    if (error.type === 'parse') {
      return 'Received an invalid response from the server.';
    }
  }

  return 'Something went wrong. Please try again.';
}
