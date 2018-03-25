
exports.up = function (knex, Promise) {
  return knex.schema.table('notifications', table => {
    table.integer('associated_item_comment')
    table.foreign('associated_item_comment', 'notifications_fk6').references('id').inTable('item_comments')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('notifications', table => {
    table.dropForeign('associated_item_comment', 'notifications_fk6')
    table.dropColumn('associated_item_comment')
  })
}
