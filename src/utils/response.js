const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const errorResponse = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    error: {
      message
    }
  };

  if (errors) {
    response.error.details = errors;
  }

  return res.status(statusCode).json(response);
};

const paginatedResponse = (res, message, data, meta, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};