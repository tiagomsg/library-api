const BookController = require('./book.controller')

describe('Book Controller', () => {
  describe('getAllBooks', () => {
    test('exists', () => {
      expect(BookController.getAllBooks)
        .toBeDefined()
    })
  })
})
