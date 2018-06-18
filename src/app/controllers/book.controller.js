const Book = require('../models/book.model')
const logger = require('winston')
const DatabaseError = require('../errors/database.error')
const BadRequestError = require('../errors/badRequest.error')
const ConflictError = require('../errors/conflict.error')
const NotFoundError = require('../errors/notFound.error')

function getAllBooks(req, res, next) {
  logger.debug('Getting all books!')
  return Book.find()
    .then((books) => {
      res.json(books)
    })
    .catch((error) => {
      const databaseError = new DatabaseError(error)
      logger.error(`Error while getting all books: ${databaseError.getMessage()}`)
      next(databaseError)
    })
}

function createBook(req, res, next) {
  if (!req.body) {
    return next(new BadRequestError('Missing body'))
  }

  if (!req.body.title) {
    return next(new BadRequestError('Missing title'))
  }

  logger.debug(`Creating book: ${req.body.title}`)
  return Book.create(req.body)
    .then(book => res.status(201)
      .send(book))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('title'))
      } else {
        next(new DatabaseError(err))
      }
    })
}

function findBookById(req, res, next) {
  if (!req.params || !req.params.bookId) {
    return next(new BadRequestError('id'))
  }

  logger.debug(`Getting book: ${req.params.bookId}`)
  return Book.findById(req.params.bookId)
    .then((book) => {
      if (!book) {
        return next(new NotFoundError(req.params.bookId))
      }
      return res.json(book)
    })
    .catch(() => {
      // TODO: check if the error is really due to ID not being valid
      next(new BadRequestError('ID provided is not valid'))
    })
}

module.exports = {
  getAllBooks,
  createBook,
  findBookById,
}
