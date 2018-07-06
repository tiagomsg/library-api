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

    test('Get all books does not expose internal properties (ie. mongoose versionKey)', done => (
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

    test('When book has extra property, book is created without that property', (done) => {
      const newBook = {
        title: 'Book 4 Title',
        slug: 'slugexample4',
        description: 'Description of the book 4',
        author: 'Author of the book 4',
        imagePath: 'Image Path 4',
        externalLink: 'Image URL 4',
        badProperty: 'test',
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
              .not.objectContaining({
                badProperty: 'test',
              }))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    })
  })

  describe('GET by ID', () => {
    const testBook = {
      title: 'Book 4 Title',
      slug: 'slugexample4',
      description: 'Description of the book 4',
      author: 'Author of the book 4',
      imagePath: 'Image Path 4',
      externalLink: 'Image URL 4',
    }
    let testBookId

    beforeEach((done) => {
      request(app)
        .post('/books')
        .send(testBook)
        .set('Accept', 'application/json')
        .expect((response) => {
          testBookId = response.body._id
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    })

    test('Get book by id', (done) => {
      request(app)
        .get(`/books/${testBookId}`)
        .expect('Content-Type', /json/)
        .expect('Content-Length', '209')
        .expect(200)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .objectContaining(Object.assign({ _id: testBookId }, testBook)))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    })

    test('When book not found return 404', done => (
      request(app)
        .get('/books/5b269336ca2a86068a5a27cf')
        .expect('Content-Type', /json/)
        .expect(404)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .objectContaining({
                error: {
                  message: 'Not found: 5b269336ca2a86068a5a27cf',
                  type: 'not_found',
                },
              }))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    ))

    test('When ID not valid return 400', done => (
      request(app)
        .get('/books/fakeid')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .objectContaining({
                error: {
                  message: 'Request error: ID provided is not valid',
                  type: 'invalid_id',
                },
              }))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    ))
  })

  describe('PUT', () => {
    let book1Id = ''

    beforeEach((done) => {
      Book.find({ title: initialTestData[0].title }, '_id', {}, (err, books) => {
        book1Id = books[0]._id.toString()
        done()
      })
    })

    test('Updating single property on an existing book', (done) => {
      request(app)
        .put(`/books/${book1Id}`)
        .set('Accept', 'application/json')
        .send({ description: 'New Description' })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .objectContaining(Object.assign(initialTestData[0], { _id: book1Id, description: 'New Description' })))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    })

    test('Updating multiple properties on an existing book', (done) => {
      request(app)
        .put(`/books/${book1Id}`)
        .set('Accept', 'application/json')
        .send({ description: 'New Description', author: 'New Author' })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .objectContaining(Object.assign(initialTestData[0], {
                _id: book1Id,
                description: 'New Description',
                author: 'New Author',
              })))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    })

    test('When new book title already exists, returns 409 error', (done) => {
      request(app)
        .put(`/books/${book1Id}`)
        .set('Accept', 'application/json')
        .send({ title: 'Book 2 Title' })
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
    })

    test('When updating book with invalid property, book is not updated', (done) => {
      request(app)
        .put(`/books/${book1Id}`)
        .set('Accept', 'application/json')
        .send({ extraProperty: 'Invalid Propery' })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .not.objectContaining({ extraProperty: 'Invalid Propery' }))
          expect(response.body)
            .toEqual(expect
              .objectContaining(Object.assign(initialTestData[0], { _id: book1Id })))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    })

    test('When updating non existing book, return 404', (done) => {
      request(app)
        .put('/books/5b269336ca2a86068a5a27cf')
        .set('Accept', 'application/json')
        .send({ description: 'New Description' })
        .expect('Content-Type', /json/)
        .expect(404)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .objectContaining({
                error: {
                  message: 'Not found: 5b269336ca2a86068a5a27cf',
                  type: 'not_found',
                },
              }))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    })

    test('When invalid ID, return 400', (done) => {
      request(app)
        .put('/books/fakeid')
        .set('Accept', 'application/json')
        .send({ description: 'New Description' })
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((response) => {
          expect(response.body)
            .toEqual(expect
              .objectContaining({
                error: {
                  message: 'Request error: ID provided is not valid',
                  type: 'invalid_id',
                },
              }))
        })
        .end((err) => {
          if (err) done(err)
          done()
        })
    })
  })
})
