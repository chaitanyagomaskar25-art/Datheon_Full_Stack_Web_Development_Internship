export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url}:`, err.message);

  // Handle Axios errors from OpenWeatherMap API
  if (err.isAxiosError) {
    if (err.response) {
      const status = err.response.status;
      const apiMessage = err.response.data?.message || err.message;

      if (status === 404) {
        return res.status(404).json({
          success: false,
          errorType: 'CITY_NOT_FOUND',
          message: 'City not found. Please check the spelling and try again.',
        });
      }

      if (status === 401 || status === 403) {
        return res.status(status).json({
          success: false,
          errorType: 'AUTH_ERROR',
          message: 'Invalid or inactive OpenWeatherMap API key on the backend.',
        });
      }

      if (status === 429) {
        return res.status(429).json({
          success: false,
          errorType: 'RATE_LIMIT',
          message: 'Weather service rate limit reached. Please wait a moment and try again.',
        });
      }

      return res.status(status).json({
        success: false,
        errorType: 'API_ERROR',
        message: `Weather service error: ${apiMessage}`,
      });
    }

    // Network error (no response received from OpenWeatherMap)
    return res.status(503).json({
      success: false,
      errorType: 'NETWORK_ERROR',
      message: 'Unable to connect to the weather service. Please check your internet connection and try again.',
    });
  }

  // Handle JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      errorType: 'TOKEN_INVALID',
      message: 'Invalid session token. Please sign in again.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      errorType: 'TOKEN_EXPIRED',
      message: 'Session has expired. Please sign in again.',
    });
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'entry';
    return res.status(409).json({
      success: false,
      errorType: 'DUPLICATE_KEY',
      message: `A record with this ${field} already exists.`,
    });
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      errorType: 'VALIDATION_ERROR',
      message: messages.join(', '),
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      errorType: 'INVALID_ID',
      message: 'Invalid resource ID provided.',
    });
  }

  // Generic fallback error
  return res.status(err.statusCode || 500).json({
    success: false,
    errorType: 'INTERNAL_ERROR',
    message: err.message || 'An unexpected internal server error occurred.',
  });
};
