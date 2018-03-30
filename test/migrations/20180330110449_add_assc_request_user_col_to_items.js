
exports.up = function(knex, Promise) {
  return knex.schema.table('items', function (table) {
    table.integer('associated_user_id').nullable().references('id').inTable('users').onDelete('SET NULL')
    table.integer('associated_request_id').nullable().references('id').inTable('requests').onDelete('SET NULL')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('items', function (table) {
    table.dropColumn('associated_user_id')
    table.dropColumn('associated_request_id')
  })
};
