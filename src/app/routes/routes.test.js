jest.mock('./books/')
jest.mock('../errors/errorHandler')
jest.mock('body-parser')

const booksRouter = require('./books/')
const errorHandler = require('../errors/errorHandler')
const bodyParser = require('body-parser')
const routes = require('./routes')

let app = {}

describe('Routes', () => {
  const urlencodedResult = 'success'
  const urlencodedMock = jest.fn(() => urlencodedResult)
  const useMock = jest.fn()
  const getMock = jest.fn()
  const allMock = jest.fn()
  const appMock = {
    use: useMock,
    get: getMock,
    all: allMock,
  }

  beforeEach(() => {
    useMock.mockClear()
    getMock.mockClear()
    allMock.mockClear()
    bodyParser.urlencoded = urlencodedMock
    app = appMock
  })

  describe('Setup middleware', () => {
    test('Configures bodyParser, books router, error handling', () => {
      routes(app)

      expect(useMock.mock.calls.length)
        .toBe(3)
      expect(useMock.mock.calls[0][0])
        .toBe(urlencodedResult)
      expect(urlencodedMock.mock.calls.length)
        .toBe(1)
      expect(urlencodedMock.mock.calls[0][0])
        .toEqual({ extended: true })
      expect(useMock.mock.calls[1][0])
        .toBe('/books')
      expect(useMock.mock.calls[1][1])
        .toBe(booksRouter())
      expect(useMock.mock.calls[2][0])
        .toBe('*')
      expect(useMock.mock.calls[2][1])
        .toBe(errorHandler.handleError)
    })

    test('Configures ping and robots.txt', () => {
      routes(app)

      expect(getMock.mock.calls.length)
        .toBe(2)
      expect(getMock.mock.calls[0][0])
        .toBe('/ping')
      expect(getMock.mock.calls[1][0])
        .toBe('/robots.txt')
      // expect(getMock.mock.calls[0][1])
      //   .toEqual((req, res) => res.sendStatus(200))
    })

    test('Configures 404', () => {
      routes(app)

      expect(allMock.mock.calls.length)
        .toBe(1)
      expect(allMock.mock.calls[0][0])
        .toBe('*')
    })
  })
})
