jest.mock('../../controllers/book.controller')
const express = require('express')
const BooksRouter = require('./books.router')
const BooksController = require('../../controllers/book.controller')
const request = require('supertest')


describe('Books Router', () => {
  let app
  let functionMock
  const expectedResponse = { test: 'test' }

  beforeEach(() => {
    app = express()
  })

  test('GET / calls and returns BooksController.getAllBooks', (done) => {
    functionMock = jest.fn()
      .mockImplementation((req, res) => {
        res.json(expectedResponse)
      })
    BooksController.getAllBooks = functionMock

    app.use('/', BooksRouter())

    request(app)
      .get('/')
      .expect(200)
      .expect((response) => {
        expect(functionMock)
          .toHaveBeenCalledTimes(1)
        expect(response.body)
          .toEqual(expect.objectContaining(expectedResponse))
      })
      .end((err) => {
        if (err) done(err)
        done()
      })
  })

  test('POST / calls and returns BooksController.createBook', (done) => {
    functionMock = jest.fn()
      .mockImplementation((req, res) => {
        res.json(expectedResponse)
      })
    BooksController.createBook = functionMock

    app.use('/', BooksRouter())

    request(app)
      .post('/')
      .expect(200)
      .expect((response) => {
        expect(functionMock)
          .toHaveBeenCalledTimes(1)
        expect(response.body)
          .toEqual(expect.objectContaining(expectedResponse))
      })
      .end((err) => {
        if (err) done(err)
        done()
      })
  })

  test('GET /{id} calls and returns BooksController.findBookById', (done) => {
    functionMock = jest.fn()
      .mockImplementation((req, res) => {
        res.json(expectedResponse)
      })
    BooksController.findBookById = functionMock

    app.use('/', BooksRouter())

    request(app)
      .get('/12345')
      .expect(200)
      .expect((response) => {
        expect(functionMock)
          .toHaveBeenCalledTimes(1)
        expect(response.body)
          .toEqual(expect.objectContaining(expectedResponse))
      })
      .end((err) => {
        if (err) done(err)
        done()
      })
  })

  test('PUT /{bookId} calls and returns BooksController.udpateBook', (done) => {
    functionMock = jest.fn()
      .mockImplementation((req, res) => {
        res.json(expectedResponse)
      })
    BooksController.updateBook = functionMock

    app.use('/', BooksRouter())

    request(app)
      .put('/12345')
      .expect(200)
      .expect((response) => {
        expect(functionMock)
          .toHaveBeenCalledTimes(1)
        expect(response.body)
          .toEqual(expect.objectContaining(expectedResponse))
      })
      .end((err) => {
        if (err) done(err)
        done()
      })
  })
})
