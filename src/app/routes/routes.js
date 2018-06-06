const cors = require('cors')
const booksRouter = require('./books/')
const errorHandler = require('../errors/errorHandler')
const bodyParser = require('body-parser')

const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}


function createRouter(app) {
  app.use(cors(corsOptions))
  // app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // logging
  app.get('/ping', (req, res) => res.sendStatus(200))
  app.get('/robots.txt', (req, res) =>
    res.set('Content-Type', 'text/plain')
      .send('User-agent: *\r\nDisallow: /'))

  app.use('/books', booksRouter())

  // All error handling
  app.use('*', errorHandler.handleError)

  // If no match, return Not Found
  app.all('*', (req, res) => res.sendStatus(404))
}

module.exports = createRouter
