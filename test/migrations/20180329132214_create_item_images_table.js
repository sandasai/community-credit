
exports.up = function(knex, Promise) {
  return knex.schema.createTable('item_images', function (table) {
    table.increments()
    table.integer('width')
    table.integer('height')
    table.string('format')
    table.integer('bytes')
    table.string('url')
    table.integer('item_id').notNullable().references('id').inTable('items').onDelete('CASCADE')
    table.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('item_images')
};
