import ErrorHandler from "../utils/errorHandler";

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Resource not found, Invalid ${err.path}`;
    error = new ErrorHandler(message, 404);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(error.errors).map((value) => value.message);
    error = new ErrorHandler(message, 404);
  }

  res.status(error.statusCode).json({
    success: false,
    error,
    message: error.message,
    // stack: err.stack,
  });
};
