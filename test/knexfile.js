// Update with your config settings.
configdb = require('../config').db

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: configdb.development.host,
      database: configdb.development.database,
      user: configdb.development.user,
      password: configdb.development.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      host: configdb.test.host,
      database: configdb.test.database,
      user: configdb.test.user,
      password: configdb.test.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: configdb.production.host,
      database: configdb.production.database,
      user: configdb.production.user,
      password: configdb.production.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

}
