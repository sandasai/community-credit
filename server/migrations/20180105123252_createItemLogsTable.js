exports.up = async function (knex, Promise) {
  await knex.schema.createTable('item_log_types', function (table) {
    table.increments()
    table.string('name').unique()
  })

  await knex('item_log_types').insert({ name: 'Talk' })
  await knex('item_log_types').insert({ name: 'Request' })
  await knex('item_log_types').insert({ name: 'Drop off' })
  await knex('item_log_types').insert({ name: 'Pick up' })
  await knex('item_log_types').insert({ name: 'Available' })
  await knex('item_log_types').insert({ name: 'Created' })

  await knex.schema.createTable('item_logs', function (table) {
    table.increments()
    table.integer('user_id')
    table.integer('item_id')
    table.string('item_log_type')
    table.dateTime('dropoff_at')
    table.dateTime('pickup_at')
    table.string('comments')
    table.timestamps()

    table.foreign('user_id', 'item_logs_fk0').references('id').inTable('users')
    table.foreign('item_id', 'item_logs_fk1').references('id').inTable('items')
    table.foreign('item_log_type', 'item_logs_fk2').references('name').inTable('item_log_types')
  })
}

exports.down = async function (knex, Promise) {
  await knex.schema.table('item_logs', function (table) {
    table.dropForeign('user_id', 'item_logs_fk0')
    table.dropForeign('item_id', 'item_logs_fk1')
    table.dropForeign('item_log_type', 'item_logs_fk2')
  })

  await knex.schema.dropTable('item_logs')

  await knex.schema.dropTable('item_log_types')
}
