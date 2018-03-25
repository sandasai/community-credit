
exports.up = function (knex, Promise) {
  return knex.schema.table('requests', table => {
    table.string('status')
    table.integer('item_id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('requests', table => {
    table.dropColumn('status')
    table.dropColumn('item_id')
  })
}
