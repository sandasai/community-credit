
exports.up = function (knex, Promise) {
  return knex.schema.table('notifications', function (table) {
    table.string('status')
    table.integer('associated_contract')
    table.integer('associated_request')
    table.integer('associated_item')

    table.foreign('associated_contract', 'notifications_fk3').references('id').inTable('contracts')
    table.foreign('associated_request', 'notifications_fk4').references('id').inTable('requests')
    table.foreign('associated_item', 'notifications_fk5').references('id').inTable('items')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('notifications', function (table) {
    table.dropForeign('associated_contract', 'notifications_fk3')
    table.dropForeign('associated_request', 'notifications_fk4')
    table.dropForeign('associated_item', 'notifications_fk5')

    table.dropColumn('status')
    table.dropColumn('associated_contract')
    table.dropColumn('associated_request')
    table.dropColumn('associated_item')
  })
}
