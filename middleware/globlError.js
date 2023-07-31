const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    statuseCode: err.statusCode,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
const sendErrorProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });


  
  // @desc    Handel reuslt Error
const globlError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};


module.exports = globlError;
