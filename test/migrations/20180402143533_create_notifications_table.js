
exports.up = async function(knex, Promise) {
  await knex.schema.createTable('item_logs', function (table) {
    table.increments()
    table.string('type')
    table.integer('item_id').references('id').inTable('items').onDelete('CASCADE')
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.text('user_message')
    table.timestamps()
  })
  return knex.schema.createTable('notifications', function (table) {
    table.increments()
    table.string('type')
    table.integer('user_id')
    table.integer('associated_item_id').references('id').inTable('items').onDelete('CASCADE')
    table.integer('associated_request_id').references('id').inTable('requests').onDelete('CASCADE')
    table.integer('associated_user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('associated_item_log_id').references('id').inTable('item_logs').onDelete('CASCADE')
    table.text('meta_message')
    table.boolean('read')
    table.boolean('obsolete')
    table.timestamps()
  })
}

exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('notifications')
  return knex.schema.dropTable('item_logs')
}
