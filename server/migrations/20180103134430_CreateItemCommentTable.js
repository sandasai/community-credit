
exports.up = function (knex, Promise) {
  return knex.schema.createTable('item_comments', function (table) {
    table.increments()
    table.integer('user_id')
    table.integer('item_id')
    table.string('content')
    table.timestamps()

    table.foreign('user_id', 'item_comments_fk0').references('id').inTable('users')
    table.foreign('item_id', 'item_comments_fk1').references('id').inTable('items')
  })
}

exports.down = async function (knex, Promise) {
  await knex.schema.table('item_comments', function (table) {
    table.dropForeign('user_id', 'item_comments_fk0')
    table.dropForeign('item_id', 'item_comments_fk1')
  })

  await knex.schema.dropTable('item_comments')
}
