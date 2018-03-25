
exports.up = function (knex, Promise) {
  return knex.schema.createTable('likes', table => {
    table.increments('id')
    table.integer('item_id')
    table.integer('user_id')
    table.timestamps()

    table.foreign('item_id', 'likes_fk0').references('id').inTable('items')
    table.foreign('user_id', 'likes_fk1').references('id').inTable('users')
  })
}

exports.down = async function (knex, Promise) {
  await knex.schema.table('likes', table => {
    table.dropForeign('item_id', 'likes_fk0')
    table.dropForeign('user_id', 'likes_fk1')
  })
  await knex.schema.dropTable('likes')
}
