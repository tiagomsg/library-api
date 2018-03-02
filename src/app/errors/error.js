const ErrorTypes = require('./errorTypes')

class Error {
  constructor(error) {
    this.error = error
    this.message = error.message
    this.httpStatusCode = 500
    this.type = ErrorTypes.GENERIC
  }

  getMessage() {
    return this.message
  }

  getHttpStatusCode() {
    return this.httpStatusCode
  }

  getType() {
    return this.type
  }

  getJson() {
    return {
      error: {
        message: this.getMessage(),
        type: this.getType().toString(),
      },
    }
  }
}

module.exports = Error
