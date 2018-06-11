const CustomError = require('./customError')

function handleError(error, req, res, next) {
  if (error instanceof CustomError) {
    return res.status(error.getHttpStatusCode())
      .json(error.getJson())
  }

  if (error instanceof Error) {
    return res.status(500)
      .json(error)
  }

  return next(error)
}

module.exports = {
  handleError,
}
