const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customErr = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong'
  }

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  if(err.code && err.code == 11000){
    customErr.statusCode = 400;
    customErr.message = `Duplicate value for ${Object.keys(err.keyValue)} field`
  }

  if(err.name == 'ValidationError'){
    customErr.message = Object.values(err.errors).map((error) => error.message).join(', ');
    customErr.statusCode = 400;
  }

  if(err.name == 'CastError'){
    customErr.message = `Provided value for ${err.path} does not match the correct syntax`;
    customErr.statusCode = StatusCodes.BAD_REQUEST;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: err })
  return res.status(customErr.statusCode).json({ err: customErr.message })
}

module.exports = errorHandlerMiddleware
