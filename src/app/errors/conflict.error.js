const CustomError = require('./customError')
const ErrorTypes = require('./errorTypes')

class ConflictError extends CustomError {
  constructor(message) {
    super(new Error(message))
    this.httpStatusCode = 409
    this.type = ErrorTypes.ALREADY_EXISTS
  }

  getMessage() {
    return `Resource already exists: ${this.message}`
  }
}

module.exports = ConflictError
