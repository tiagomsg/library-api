const ErrorTypes = Object.freeze({
  GENERIC: Symbol('generic'),
  CONNECTION: Symbol('connection'),
  MISSING_FIELD: Symbol('missing_field'),
})

module.exports = ErrorTypes
