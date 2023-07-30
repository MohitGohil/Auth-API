const errorHandler = (err, req, res, next) => {
  let statusCode, message;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  } else if (err.code === 11000) {
    statusCode = 400;
    message = `${Object.keys(err.keyValue)} field has to be unique`; // Duplicate key error
  } else {
    statusCode = err.statusCode || 500;
    message = err.message || "Something went wrong, try again later"; // Unhandled error
  }
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
