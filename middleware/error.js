const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongo ID Error
  if (err.name === "CastError") {
    const message = `Resource Not Found, Invalid : ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongo Dublicate Field Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${value}. Please use another value for ${field}.`;
    err = new ErrorHandler(message, 400);
  }

  // Mongo Validation Error
  if (err.code === 11000) {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid Data Entered, ${errors.join(". ")}`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid JWT token used";
    err = new ErrorHandler(message, 400);
  }

  // Token Expired Error
  if (err.name === "TokenExpiredError") {
    const message = "Token is expired";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: "false",
    message: err.message,
    // these below are not necessary. just for ease of use in devlopment //
    err: err,
    errorStack: err.stack,
    // these below are not necessary. just for ease of use in devlopment //
  });
};
