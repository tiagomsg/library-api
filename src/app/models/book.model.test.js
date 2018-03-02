const BookModel = require('./book.model')

describe('Book Model', () => {
  describe('Configuration', () => {
    test('sets defaults on insert', () => {
      expect(BookModel.schema.options.setDefaultsOnInsert)
        .toBeTruthy()
    })
  })

  describe('Hooks', () => {
    test.skip('set slug on save', () => {

    })
  })

  describe('Title', () => {
    test('exists', () => {
      expect(BookModel.schema.paths.title)
        .toBeDefined()
    })

    test('is required', () => {
      expect(BookModel.schema.paths.title.options.required)
        .toBeTruthy()
    })

    test('is a String', () => {
      expect(typeof BookModel.schema.paths.title.options.type())
        .toBe('string')
    })
  })

  describe('Slug', () => {
    test('exists', () => {
      expect(BookModel.schema.paths.slug)
        .toBeDefined()
    })

    test('is not required', () => {
      expect(BookModel.schema.paths.slug.options.required)
        .toBeFalsy()
    })

    test('is a String', () => {
      expect(typeof BookModel.schema.paths.slug.options.type())
        .toBe('string')
    })
  })

  describe('Description', () => {
    test('exists', () => {
      expect(BookModel.schema.paths.description)
        .toBeDefined()
    })

    test('is not required', () => {
      expect(BookModel.schema.paths.description.options.required)
        .toBeFalsy()
    })

    test('is a String', () => {
      expect(typeof BookModel.schema.paths.description.options.type())
        .toBe('string')
    })
  })

  describe('Author', () => {
    test('exists', () => {
      expect(BookModel.schema.paths.author)
        .toBeDefined()
    })

    test('is not required', () => {
      expect(BookModel.schema.paths.author.options.required)
        .toBeFalsy()
    })

    test('is a String', () => {
      expect(typeof BookModel.schema.paths.author.options.type())
        .toBe('string')
    })
  })

  describe('ImagePath', () => {
    test('exists', () => {
      expect(BookModel.schema.paths.imagePath)
        .toBeDefined()
    })

    test('is not required', () => {
      expect(BookModel.schema.paths.imagePath.options.required)
        .toBeFalsy()
    })

    test('is a String', () => {
      expect(typeof BookModel.schema.paths.imagePath.options.type())
        .toBe('string')
    })
  })

  describe('ExternalLink', () => {
    test('exists', () => {
      expect(BookModel.schema.paths.externalLink)
        .toBeDefined()
    })

    test('is not required', () => {
      expect(BookModel.schema.paths.externalLink.options.required)
        .toBeFalsy()
    })

    test('is a String', () => {
      expect(typeof BookModel.schema.paths.externalLink.options.type())
        .toBe('string')
    })
  })
})
