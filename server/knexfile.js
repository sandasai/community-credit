// Update with your config settings.
const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
})

module.exports = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}
