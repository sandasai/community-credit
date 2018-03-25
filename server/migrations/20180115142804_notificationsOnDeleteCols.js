
exports.up = function (knex, Promise) {
  return knex.schema.table('notifications', table => {
    table.dropForeign('associated_request', 'notifications_fk4')
    table.dropForeign('associated_item', 'notifications_fk5')
    table.dropForeign('associated_item_log', 'notifications_fk3')
    table.dropForeign('associated_item_comment', 'notifications_fk6')

    table.foreign('associated_request', 'notifications_fk4').references('id').inTable('requests').onDelete('SET NULL')
    table.foreign('associated_item', 'notifications_fk5').references('id').inTable('items').onDelete('SET NULL')
    table.foreign('associated_item_log', 'notifications_fk3').references('id').inTable('item_logs').onDelete('SET NULL')
    table.foreign('associated_item_comment', 'notifications_fk6').references('id').inTable('item_comments').onDelete('SET NULL')
  })
}

exports.down = function (knex, Promise) {

}
