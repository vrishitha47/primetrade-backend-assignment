const ApiError = require('../utils/ApiError');

const normalizeError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.name === 'CastError') {
    return new ApiError(400, `Invalid ${error.path}: ${error.value}`);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    return new ApiError(400, `${field} already exists`);
  }

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));
    return new ApiError(400, 'Validation failed', errors);
  }

  if (error.name === 'JsonWebTokenError') {
    return new ApiError(401, 'Invalid authentication token');
  }

  if (error.name === 'TokenExpiredError') {
    return new ApiError(401, 'Authentication token has expired');
  }

  return new ApiError(error.statusCode || 500, error.message || 'Internal server error');
};

const errorHandler = (error, req, res, next) => {
  const normalized = normalizeError(error);
  const statusCode = normalized.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: normalized.message,
    errors: normalized.errors,
    stack: process.env.NODE_ENV === 'development' ? normalized.stack : undefined
  });
};

module.exports = { errorHandler };
