const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

global.__rootdir = __dirname

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json())

// Enabls CORS
app.use(require('cors')())

app.use('/', require('./routes'))

const port = process.env.PORT || 8888
app.listen(port)

console.log('listening on port ' + port)
