jest.mock('./books/')
jest.mock('../errors/errorHandler')
jest.mock('body-parser')
jest.mock('cors')

const booksRouter = require('./books/')
const errorHandler = require('../errors/errorHandler')
const bodyParser = require('body-parser')
const routes = require('./routes')

let app = {}

describe('Routes', () => {
  const urlencodedResult = 'success'
  const urlencodedMock = jest.fn(() => urlencodedResult)
  const jsonMock = jest.fn()
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
    jsonMock.mockClear()
    bodyParser.json = jsonMock
    app = appMock
  })

  describe('Setup middleware', () => {
    test('Configures bodyParser, json, books router, error handling', () => {
      routes(app)

      expect(urlencodedMock)
        .toHaveBeenCalledTimes(1)
      expect(urlencodedMock)
        .toHaveBeenCalledWith({ extended: true })
      expect(jsonMock)
        .toHaveBeenCalledTimes(1)
      expect(useMock)
        .toHaveBeenCalledTimes(5)
      // TODO: test cors configuration
      expect(useMock)
        .toHaveBeenCalledWith(urlencodedResult)
      expect(useMock)
        .toHaveBeenCalledWith(expect.stringMatching('\\/books'), booksRouter())
      expect(useMock)
        .toHaveBeenLastCalledWith(expect.stringMatching('\\*'), errorHandler.handleError)
    })

    test('Configures ping and robots.txt', () => {
      routes(app)

      expect(getMock)
        .toHaveBeenCalledTimes(2)
      expect(getMock)
        .toHaveBeenCalledWith(expect.stringMatching('\\/ping'), expect.any(Function))
      expect(getMock)
        .toHaveBeenCalledWith(expect.stringMatching('\\/robots.txt'), expect.any(Function))
    })

    test('Configures 404', () => {
      routes(app)

      expect(allMock)
        .toHaveBeenCalledTimes(1)
      expect(allMock)
        .toHaveBeenLastCalledWith(expect.stringMatching('\\*'), expect.any(Function))
    })
  })
})
