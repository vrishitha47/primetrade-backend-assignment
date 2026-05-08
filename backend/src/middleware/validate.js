const { validationResult } = require('express-validator');

const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((error) => ({
      field: error.path,
      message: error.msg
    }));

    return next(new ApiError(400, 'Validation failed', errors));
  }

  return next();
};

module.exports = validate;
