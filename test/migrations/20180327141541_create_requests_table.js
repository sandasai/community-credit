
exports.up = function(knex, Promise) {
  return knex.schema.createTable('requests', function (table) {
    table.increments()
    table.integer('user_id').notNullable()
    table.string('item')
    table.text('description')
    table.string('status')
    table.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('requests')
}
