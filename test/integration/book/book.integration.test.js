const request = require('supertest')
const mongoose = require('mongoose')

const app = require('../../../server')
const Book = require('../../../src/app/models/book.model')

describe('/books', () => {
  const initialTestData = [{
    title: 'Book 1 Title',
    slug: 'slugexample1',
    description: 'Description of the book 1',
    author: 'Author of the book 1',
    imagePath: 'Image Path 1',
    externalLink: 'Image URL 1',
  }, {
    title: 'Book 2 Title',
    slug: 'slugexample2',
    description: 'Description of the book 2',
    author: 'Author of the book 2',
    imagePath: 'Image Path 2',
    externalLink: 'Image URL 2',
  }]

  beforeEach((done) => {
    Book.remove()
      .then(() => Book.create(initialTestData))
      .then(() => done())
      .catch(err => console.error(err))
  })

  afterAll((done) => {
    // Clean the book collection in the DB
    Book.remove()
      .then(() => mongoose.connection.close(true))// required, otherwise
      // jest hangs due to open mongoose connection. Boolean is to force it.
      .then(done())
      .catch(err => console.warn(err))
  })

  test('Get all books', done => (
    request(app)
      .get('/books')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '421')
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(expect.arrayContaining([
          expect.objectContaining(Object.assign({ _id: expect.anything() }, initialTestData[0])),
          expect.objectContaining(Object.assign({ _id: expect.anything() }, initialTestData[1])),
        ]))
      })
      .end((err) => {
        if (err) done(err)
        done()
      })
  ))

  test('Get all books does not expose internal properties (ie. mongoose versionKey', done => (
    request(app)
      .get('/books')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '421')
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(expect.arrayContaining([
          expect.not.objectContaining({ __v: expect.anything() }),
          expect.not.objectContaining({ __v: expect.anything() }),
        ]))
      })
      .end((err) => {
        if (err) done(err)
        done()
      })
  ))
})
