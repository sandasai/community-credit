
exports.up = function(knex, Promise) {
  return knex.schema.table('item_images', function (table) {
    table.string('remote_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('item_images', function (table) {
    table.dropColumn('remote_id')
  })
};
