const express = require('express')
const BooksController = require('../../controllers/book.controller')

function createBooksRouter() {
  const router = express.Router()

  router
    .route('/')
    .get(BooksController.getAllBooks)
    .post(BooksController.createBook)

  router
    .route('/:bookId')
    .get(BooksController.findBookById)

  return router
}

module.exports = createBooksRouter
