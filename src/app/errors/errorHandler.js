const Error = require('./error')

function handleError(error, req, res, next) {
  if (error instanceof Error) {
    return res.status(error.getHttpStatusCode())
      .json(error.getJson())
  }
  return next(error)
}

module.exports = {
  handleError,
}
