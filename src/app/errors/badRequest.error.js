const CustomError = require('./customError')
const ErrorTypes = require('./errorTypes')

class BadRequestError extends CustomError {
  constructor(message) {
    super(new Error(message))
    this.httpStatusCode = 400
    this.type = ErrorTypes.MISSING_FIELD
  }

  getMessage() {
    return `Request error: ${this.message}`
  }
}

module.exports = BadRequestError
