const mongoose = require('mongoose')

const Schema = mongoose.Schema
const slugHandlerFactory = require('../helpers/slug.js')

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: { type: String },
    description: String,
    author: String,
    imagePath: String,
    externalLink: String,
  },
  { setDefaultsOnInsert: true },
)

let BookModel = {}

BookSchema.pre(
  'save',
  slugHandlerFactory.handle(BookModel, 'title'),
)

BookModel = mongoose.model(
  'Book',
  BookSchema,
  'books',
)

module.exports = BookModel
