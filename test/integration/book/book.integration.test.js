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

  describe('GET', () => {
    test('Get all books', done => (
      request(app)
        .get('/books')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '421')
        .expect(200)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect.arrayContaining([
              expect.objectContaining(Object
                .assign({ _id: expect.anything() }, initialTestData[0])),
              expect.objectContaining(Object
                .assign({ _id: expect.anything() }, initialTestData[1])),
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
          expect(response.body)
            .toEqual(expect.arrayContaining([
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

  describe('POST', () => {
    test('Create a new book', (done) => {
      const newBook = {
        title: 'Book 3 Title',
        slug: 'slugexample3',
        description: 'Description of the book 3',
        author: 'Author of the book 3',
        imagePath: 'Image Path 3',
        externalLink: 'Image URL 3',
      }

      request(app)
        .post('/books')
        .send(newBook)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .objectContaining(Object.assign({ _id: expect.anything() }, newBook)))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    })

    test('When book title already exist, returns 409 error', done => (
      request(app)
        .post('/books')
        .send({ title: initialTestData[0].title })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(409)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .objectContaining({
                error: {
                  message: 'Resource already exists: title',
                  type: 'already_exists',
                },
              }))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    ))
  })
})
