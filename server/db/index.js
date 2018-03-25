const connection = process.env.DATABASE_URL || require('../config').db

const knex = require('knex')({
  client: 'pg',
  connection: connection,
  pool: { min: 0, max: 7 }
})

module.exports = knex
