
exports.up = function (knex, Promise) {
  return knex.schema.createTable('requests', function (table) {
    table.increments()
    table.integer('user_id').notNullable()
    table.foreign('user_id', 'requests_fk0').references('id').inTable('users')
    table.string('item')
    table.text('description')
    table.timestamps()
  })
}

exports.down = function (knex, Promise) {
  knex.schema.table('requests', function (table) {
    table.dropForeign('user_id', 'requests_fk0')
  })
  return knex.schema.dropTable('requests')
}
