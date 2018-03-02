const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 8080
const dbUrl = process.env.DB_URL

mongoose.Promise = global.Promise
mongoose.connect(dbUrl)
console.log(`Mongo on ${dbUrl}`)

if (!module.parent) { app.listen(port) }
console.log(`App listening on port ${port}`)


// Setup routing
require('./src/app/routes')(app)

module.exports = app
