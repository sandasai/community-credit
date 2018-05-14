
exports.up = function(knex, Promise) {
  return knex.schema.table('item_logs', function (table) {
    table.text('message')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('item_logs', function (table) {
    table.dropColumn('message')
  })
};
