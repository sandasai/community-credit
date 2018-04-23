const { knex } = require('./db')

// run migrations
knex.migrate.latest().then(() => {
  console.log('finished migrating')
  process.exit(0)
})
