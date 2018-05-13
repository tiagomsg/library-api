jest.mock('express')
jest.mock('../../controllers/book.controller')
const express = require('express')
const BooksRouter = require('./books.router')
const BooksController = require('../../controllers/book.controller')


describe('Books Router', () => {
  describe('Create routes', () => {
    test('Routes GET \'/\' to BooksController.getAllBooks', () => {
      const mockGet = jest.fn()
      const routeMock = jest.fn().mockReturnThis()
      const routerMock = {
        route: routeMock,
        get: mockGet,
      }
      express.Router.mockImplementation(() => routerMock)

      expect(BooksRouter())
        .toBe(routerMock)
      expect(routeMock)
        .toHaveBeenCalledTimes(1)
      expect(routeMock)
        .toHaveBeenCalledWith(expect.stringMatching('/'))
      expect(mockGet)
        .toHaveBeenCalledTimes(1)
      expect(mockGet)
        .toHaveBeenCalledWith(BooksController.getAllBooks)
    })
  })
})
