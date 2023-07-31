class apiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode; 
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOpration = true;
    this.message = message;
  }
}

module.exports = apiError;
