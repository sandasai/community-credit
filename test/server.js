const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
  })
}

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'))
}

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ type: 'application/json' }))

// Enabls CORS
app.use(require('cors')())
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/dist')))
}
app.use(require('./routes'))

const port = process.env.PORT || 8888
app.listen(port)

console.log('listening on port ' + port)

module.export = app;
