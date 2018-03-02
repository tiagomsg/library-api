const Book = require('../models/book.model')
const logger = require('winston')
const DatabaseError = require('../errors/database.error')

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

// function createBook(req, res, next) {
//   if (!req.body) {
//     return res.sendStatus(500)
//   }
//
//   validateRequest()
//   const book = new Book(req.body)
//   return book
//     .save()
//     .then(savedBook => res.status(201)
//       .send(savedBook))
//     .catch(err => next(err))
// }
//
// function validateCreateBookRequest(book) {
//   if(!book.title || !book.description || !book.author) {
//
//   }
// }

module.exports = {
  getAllBooks,
  // createBook
}
