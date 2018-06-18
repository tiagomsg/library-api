const CustomError = require('./customError')
const ErrorTypes = require('./errorTypes')

class NotFoundError extends CustomError {
  constructor(message) {
    super(new Error(message))
    this.httpStatusCode = 404
    this.type = ErrorTypes.NOT_FOUND
  }

  getMessage() {
    return `Not found: ${this.message}`
  }
}

module.exports = NotFoundError
