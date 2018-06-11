/* eslint no-param-reassign:
 ["error",{ "props": true, "ignorePropertyModificationsFor": ["ret"] }]
 */
/* eslint no-underscore-dangle: "off" */
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const slugHandlerFactory = require('../helpers/slug.js')

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: { unique: true },
    },
    slug: { type: String },
    description: String,
    author: String,
    imagePath: String,
    externalLink: String,
  },
  {
    setDefaultsOnInsert: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
        return ret
      },
    },
  },
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

