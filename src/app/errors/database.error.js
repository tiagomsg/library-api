const Error = require('./error')
const ErrorTypes = require('./errorTypes')

class DatabaseError extends Error {
  constructor(error) {
    super(error)
    this.httpStatusCode = 502
    this.type = ErrorTypes.CONNECTION
  }

  getMessage() {
    return `Database error: ${this.message}`
  }
}

module.exports = DatabaseError
