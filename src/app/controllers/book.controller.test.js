/* eslint-disable */

const mockingoose = require('mockingoose').default
const Book = require('../models/book.model')
const BookController = require('./book.controller')
const DatabaseError = require('../errors/database.error')
const BadRequestError = require('../errors/badRequest.error')
const ConflictError = require('../errors/conflict.error')
const NotFoundError = require('../errors/notFound.error')


describe('Book Controller', () => {

  const book1 = {
    title: 'Book 1 Title',
    slug: 'slugexample1',
    description: 'Description of the book 1',
    author: 'Author of the book 1',
    imagePath: 'Image Path 1',
    externalLink: 'Image URL 1',
  }
  const book2 = {
    title: 'Book 2 Title',
    slug: 'slugexample2',
    description: 'Description of the book 2',
    author: 'Author of the book 2',
    imagePath: 'Image Path 2',
    externalLink: 'Image URL 2',
  }
  let reqMock
  let resMock
  let nextMock

  beforeEach(() => {
    mockingoose.resetAll()
    jest.clearAllMocks()
    reqMock = {}
    resMock = {}
    nextMock = {}
  })


  //-----------------
  //-- GetAllBooks --
  //-----------------
  describe('getAllBooks', () => {

    test('exists', () => {
      expect(BookController.getAllBooks)
        .toBeDefined()
    })

    test('when no books returned then returns empty JSON array', () => {
      mockingoose.Book.toReturn([])
      resMock.json = jest.fn()
        .mockImplementation((bookList) => bookList)

      return BookController.getAllBooks(reqMock, resMock, nextMock)
        .then(() => {
          expect(resMock.json)
            .toHaveBeenCalledTimes(1)
          expect(resMock.json.mock.calls[0][0])
            .toHaveLength(0)
        })
    })

    test('when single book returned then returns JSON array with single book', () => {
      mockingoose.Book.toReturn([book1])
      resMock.json = jest.fn()
        .mockImplementation((bookList) => bookList)

      return BookController.getAllBooks(reqMock, resMock, nextMock)
        .then(() => {
          expect(resMock.json)
            .toHaveBeenCalledTimes(1)
          expect(resMock.json.mock.calls[0][0])
            .toHaveLength(1)
          expect(resMock.json)
            .toHaveBeenCalledWith(
              expect.arrayContaining([
                expect.objectContaining(Object.assign({ _id: expect.anything() }, book1)),
              ]),
            )
        })
    })

    test('when multiple books returned then returns JSON array with multiple books', () => {
      mockingoose.Book.toReturn([book1, book2])
      resMock.json = jest.fn()
        .mockImplementation((bookList) => bookList)

      return BookController.getAllBooks(reqMock, resMock, nextMock)
        .then(() => {
          expect(resMock.json)
            .toHaveBeenCalledTimes(1)
          expect(resMock.json.mock.calls[0][0])
            .toHaveLength(2)
          expect(resMock.json)
            .toHaveBeenCalledWith(
              expect.arrayContaining([
                expect.objectContaining(Object.assign({ _id: expect.anything() }, book1)),
                expect.objectContaining(Object.assign({ _id: expect.anything() }, book2)),
              ]),
            )
        })
    })

    test('when error from mongoose then call next with DatabaseError', () => {
      const expectedError = new Error('My Error')
      mockingoose.Book.toReturn(expectedError, 'find')
      nextMock = jest.fn()

      return BookController.getAllBooks(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new DatabaseError(expectedError),
            )
        })
    })
  })

  //----------------
  //-- CreateBook --
  //----------------
  describe('createBook', () => {

    test('exists', () => {
      expect(BookController.createBook)
        .toBeDefined()
    })

    test('when no body, then call next with bad request error', () => {
      nextMock = jest.fn()

      BookController.createBook(reqMock, resMock, nextMock)

      expect(nextMock)
        .toHaveBeenCalledTimes(1)
      expect(nextMock)
        .toHaveBeenCalledWith(new BadRequestError('Missing body'))
    })

    test('when no title, then call next with bad request error', () => {
      const requestBody = Object.assign({}, book1)
      delete requestBody.title
      reqMock.body = requestBody
      nextMock = jest.fn()

      BookController.createBook(reqMock, resMock, nextMock)

      expect(nextMock)
        .toHaveBeenCalledTimes(1)
      expect(nextMock)
        .toHaveBeenCalledWith(new BadRequestError('Missing title'))
    })

    test('when valid request, then save book and return 201 with saved book', () => {
      expect.assertions(4)
      const requestBody = Object.assign({}, book1)
      reqMock.body = requestBody
      resMock.status = jest.fn()
        .mockReturnThis()
      resMock.send = jest.fn()
        .mockReturnThis()
      //to make sure save() is called, making it return a different book than the input
      mockingoose.Book.toReturn(book2, 'save')

      return BookController.createBook(reqMock, resMock, nextMock)
        .then(() => {
          expect(resMock.status)
            .toHaveBeenCalledTimes(1)
          expect(resMock.status)
            .toHaveBeenCalledWith(201)
          expect(resMock.send)
            .toHaveBeenCalledTimes(1)
          expect(resMock.send)
            .toHaveBeenCalledWith(
              expect.objectContaining(
                Object.assign({ _id: expect.anything() }, book2)))
        })
    })

    test('when title already exists, then call next with ConflictError with unique field name',
      () => {
        const requestBody = Object.assign({}, book1)
        reqMock.body = requestBody
        nextMock = jest.fn()
        const expectedError = new Error('My Error')
        expectedError.code = 11000 // Mongo error code for duplication
        mockingoose.Book.toReturn(expectedError, 'save')

        return BookController.createBook(reqMock, resMock, nextMock)
          .then(() => {
            expect(nextMock)
              .toHaveBeenCalledTimes(1)
            expect(nextMock)
              .toHaveBeenCalledWith(
                new ConflictError('title'))
          })
      })

    test('when error saving, then call next with DatabaseError', () => {
      const requestBody = Object.assign({}, book1)
      reqMock.body = requestBody
      nextMock = jest.fn()
      const expectedError = new Error('My Error')
      mockingoose.Book.toReturn(expectedError, 'save')

      return BookController.createBook(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new DatabaseError(expectedError))
        })
    })
  })


  //------------------
  //-- FindBookById --
  //------------------
  describe('findBookById', () => {

    test('exists', () => {
      expect(BookController.findBookById)
        .toBeDefined()
    })

    test('when ID not provided, return 400 Bad Request', () => {
      reqMock.params = {}
      nextMock = jest.fn()

      BookController.findBookById(reqMock, resMock, nextMock)

      expect(nextMock)
        .toHaveBeenCalledTimes(1)
      expect(nextMock)
        .toHaveBeenCalledWith(
          new BadRequestError('id'))
    })

    test('when ID not valid, return 400 Bad Request', () => {
      reqMock.params = { bookId: 'bookId' }
      nextMock = jest.fn()
      const expectedError = new Error('bla bla Cast to ObjectId failed bla bla')
      mockingoose.Book.toReturn(expectedError, 'findOne')

      return BookController.findBookById(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new BadRequestError('ID provided is not valid').invalidId())
        })
    })

    test('when book exists, then returns JSON with book', () => {
      reqMock.params = { bookId: 'bookId' }
      mockingoose.Book.toReturn(book1, 'findOne')
      resMock.json = jest.fn()
        .mockImplementation((book) => book)

      return BookController.findBookById(reqMock, resMock, nextMock)
        .then(() => {
          expect(resMock.json)
            .toHaveBeenCalledTimes(1)
          expect(resMock.json)
            .toHaveBeenCalledWith(
              expect.objectContaining(
                Object.assign({ _id: expect.anything() }, book1)),
            )
        })
    })

    test('when book does not exist, return 404 Not Found', () => {
      reqMock.params = { bookId: 'bookId' }
      nextMock = jest.fn()
      mockingoose.Book.toReturn(undefined, 'findOne')

      return BookController.findBookById(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new NotFoundError('bookId'),
            )
        })
    })

    test('when database error, return 400 Database Error', () => {
      reqMock.params = { bookId: 'bookId' }
      nextMock = jest.fn()
      const expectedError = new Error('Generic Database error')
      mockingoose.Book.toReturn(expectedError, 'findOne')

      return BookController.findBookById(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new DatabaseError(expectedError),
            )
        })
    })
  })

  //----------------
  //-- UpdateBook --
  //----------------
  describe('updateBook', () => {

    test('exists', () => {
      expect(BookController.updateBook)
        .toBeDefined()
    })

    test('when no body, then call next with bad request error', () => {
      nextMock = jest.fn()

      BookController.updateBook(reqMock, resMock, nextMock)

      expect(nextMock)
        .toHaveBeenCalledTimes(1)
      expect(nextMock)
        .toHaveBeenCalledWith(new BadRequestError('Missing body'))
    })

    test('when object ID does not match the params ID, then call next with bad request error', () => {
      const requestBody = Object.assign({ _id: 'bodyID' }, book1)
      const params = { bookId: 'urlID' }
      reqMock.body = requestBody
      reqMock.params = params
      nextMock = jest.fn()

      BookController.updateBook(reqMock, resMock, nextMock)

      expect(nextMock)
        .toHaveBeenCalledTimes(1)
      expect(nextMock)
        .toHaveBeenCalledWith(new BadRequestError('IDs not matching'))
    })

    test('when setting title to empty, then call next with bad request error', () => {
      const requestBody = Object.assign({ title: '' })
      const params = { bookId: 'id' }
      reqMock.body = requestBody
      reqMock.params = params
      nextMock = jest.fn()

      BookController.updateBook(reqMock, resMock, nextMock)

      expect(nextMock)
        .toHaveBeenCalledTimes(1)
      expect(nextMock)
        .toHaveBeenCalledWith(new BadRequestError('Title must be filled'))
    })

    test('when single property, then update property and return 200 with saved book', () => {
      expect.assertions(4)
      const requestBody = Object.assign({ description: 'New Description' })
      const params = { bookId: 'id' }
      reqMock.body = requestBody
      reqMock.params = params
      resMock.status = jest.fn()
        .mockReturnThis()
      resMock.json = jest.fn()
        .mockReturnThis()
      //to make sure findOneAndUpdate() is called, making it return a different book than the input
      mockingoose.Book.toReturn(book2, 'findOneAndUpdate')

      return BookController.updateBook(reqMock, resMock, nextMock)
        .then(() => {
          expect(resMock.status)
            .toHaveBeenCalledTimes(1)
          expect(resMock.status)
            .toHaveBeenCalledWith(200)
          expect(resMock.json)
            .toHaveBeenCalledTimes(1)
          expect(resMock.json)
            .toHaveBeenCalledWith(
              expect.objectContaining(
                Object.assign({ _id: expect.anything() }, book2)))
        })
    })

    test('when multiple properties, then update properties and return 200 with saved book', () => {
      expect.assertions(4)
      const requestBody = Object.assign({
        description: 'New Description',
        title: 'New Title',
      })
      const params = { bookId: 'id' }
      reqMock.body = requestBody
      reqMock.params = params
      resMock.status = jest.fn()
        .mockReturnThis()
      resMock.json = jest.fn()
        .mockReturnThis()
      //to make sure findOneAndUpdate() is called, making it return a different book than the input
      mockingoose.Book.toReturn(book2, 'findOneAndUpdate')

      return BookController.updateBook(reqMock, resMock, nextMock)
        .then(() => {
          expect(resMock.status)
            .toHaveBeenCalledTimes(1)
          expect(resMock.status)
            .toHaveBeenCalledWith(200)
          expect(resMock.json)
            .toHaveBeenCalledTimes(1)
          expect(resMock.json)
            .toHaveBeenCalledWith(
              expect.objectContaining(
                Object.assign({ _id: expect.anything() }, book2)))
        })
    })

    test('when book does not exist, then call next with Not Found error', () => {
      expect.assertions(2)
      const requestBody = Object.assign({ description: 'New Description' })
      const params = { bookId: 'id' }
      reqMock.body = requestBody
      reqMock.params = params
      nextMock = jest.fn()
      mockingoose.Book.toReturn(null, 'findOneAndUpdate')

      return BookController.updateBook(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new NotFoundError('id'))
        })
    })

    test('when new title already exists, then call next with ConflictError with unique field name', () => {
      const params = { bookId: 'id' }
      reqMock.params = params
      reqMock.body = { title: 'already exists' }
      nextMock = jest.fn()
      const expectedError = new Error('My Error')
      expectedError.code = 11000 // Mongo error code for duplication
      mockingoose.Book.toReturn(expectedError, 'findOneAndUpdate')

      return BookController.updateBook(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new ConflictError('title'))
        })
    })

    test('when bookId is invalid, then call next with Bad Request error', () => {
      const params = { bookId: 'id' }
      reqMock.params = params
      reqMock.body = { title: 'test title' }
      nextMock = jest.fn()
      const expectedError = new Error('bla bla Cast to ObjectId failed bla bla')
      mockingoose.Book.toReturn(expectedError, 'findOneAndUpdate')

      return BookController.updateBook(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new BadRequestError('ID provided is not valid').invalidId())
        })
    })

    test('when error saving, then call next with DatabaseError', () => {
      const params = { bookId: 'id' }
      reqMock.params = params
      reqMock.body = { title: 'already exists' }
      nextMock = jest.fn()
      const expectedError = new Error('My Error')
      mockingoose.Book.toReturn(expectedError, 'findOneAndUpdate')

      return BookController.updateBook(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new DatabaseError(expectedError))
        })
    })
  })
})
