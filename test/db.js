let configdb;
let connection = process.env.DATABASE_URL

const knex = require('knex')({
  client: 'pg',
  connection,
  pool: { min: 0, max: 7 }
})

var bookshelf = require('bookshelf')(knex);

module.exports = {
  knex, bookshelf
}