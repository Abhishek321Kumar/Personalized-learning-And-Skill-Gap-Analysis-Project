export const errorHandler = (error, _req, res, _next) => {
  console.error(error);
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Something went wrong on the server."
  });
};

