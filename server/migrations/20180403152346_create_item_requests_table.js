
exports.up = function(knex, Promise) {
  return knex.schema.createTable('item_requests', function (table) {
    table.increments()
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('item_id').references('id').inTable('items').onDelete('CASCADE')
    table.string('status')
    table.timestamps()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('item_requests')
};
