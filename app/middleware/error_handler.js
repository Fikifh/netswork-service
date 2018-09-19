'use strict';

const ApiError = require('../utils/ApiError');

// TODO: Add error handling
module.exports = (error, req, res) => {
  if (error instanceof ApiError) {
    const errorBody = {
      error: error.error,
      status: error.status,
      code: error.code,
      message: error.message,
    };

    if (error.error_details) {
      errorBody.error_details = error.error_details;
    }
    return res.send(errorBody);
  }

  // TODO: Send error log
  return res.status(500).end();
};
