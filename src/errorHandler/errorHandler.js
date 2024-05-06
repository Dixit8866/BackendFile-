// errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || 500,
  });
};

export default errorHandler;
