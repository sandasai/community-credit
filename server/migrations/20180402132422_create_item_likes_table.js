
exports.up = function(knex, Promise) {
  return knex.schema.createTable('item_likes', function (table) {
    table.increments()
    table.integer('item_id').notNullable().references('id').inTable('items').onDelete('CASCADE')
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('item_likes')
}
