let configdb;

if (process.env.NODE_ENV === 'production') {
  configdb = require('../config.json').db.production
} else {
  configdb = require('../config.json').db.development
}

const { host, user, password, database, port } = configdb

const knex = require('knex')({
  client: 'pg',
  connection: {
    host,
    user,
    password,
    database
  },
  pool: { min: 0, max: 7 }
})

var bookshelf = require('bookshelf')(knex);

module.exports = {
  knex, bookshelf
}