
exports.up = async function(knex, Promise) {
  await knex.schema.createTable('items', function (table) {
    table.increments()
    table.integer('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.integer('holder_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.string('name')
    table.text('description')
    table.string('status')
    table.timestamps()
  })

  return knex.schema.table('requests', function (table) {
    table.foreign('user_id').references('users.id')
  })
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('items')
  return knex.schema.table('requests', function (table) {
    table.dropForeign('user_id')
  })
};
