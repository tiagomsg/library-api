const CustomError = require('./customError')
const ErrorTypes = require('./errorTypes')

class DatabaseError extends CustomError {
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
