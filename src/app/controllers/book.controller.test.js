/* eslint-disable */

const mockingoose = require('mockingoose').default
const Book = require('../models/book.model')
const BookController = require('./book.controller')
const DatabaseError = require('../errors/database.error')


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
                expect.objectContaining(Object.assign({_id: expect.anything()}, book1))
              ])
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
                expect.objectContaining(Object.assign({_id: expect.anything()}, book1)),
                expect.objectContaining(Object.assign({_id: expect.anything()}, book2))
              ])
            )
        })
    })

    test('when error from mongoose then call next with DatabaseError', () => {
      const expectedError = new Error('My Error')
      mockingoose.Book.toReturn(expectedError, 'find');
      nextMock = jest.fn()

      return BookController.getAllBooks(reqMock, resMock, nextMock)
        .then(() => {
          expect(nextMock)
            .toHaveBeenCalledTimes(1)
          expect(nextMock)
            .toHaveBeenCalledWith(
              new DatabaseError(expectedError)
            )
        })
    })
  })

  // describe('createBook', () => {
  //
  //   test('exists', () => {
  //     expect(BookController.createBook)
  //       .toBeDefined()
  //   })
  //   //
  //   // test('when no body,', () => {
  //   //   expect(BookController.createBook)
  //   //     .toBeDefined()
  //   // })
  //
  //
  // })

})
