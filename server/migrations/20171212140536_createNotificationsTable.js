
exports.up = async function (knex, Promise) {
  await knex.schema.createTable('notification_types', function (table) {
    table.increments()
    table.string('name').unique()
    table.timestamps()
  })

  await knex('notification_types').insert({ name: 'Request' })
  await knex('notification_types').insert({ name: 'Request Fulfiled' })
  await knex('notification_types').insert({ name: 'Item Returned' })
  await knex('notification_types').insert({ name: 'Item Available' })
  await knex('notification_types').insert({ name: 'Item Taken' })

  await knex.schema.createTable('notifications', function (table) {
    table.increments()
    table.integer('to_user_id').notNullable()
    table.foreign('to_user_id', 'notifications_fk0').references('id').inTable('users')
    table.integer('from_user_id')
    table.foreign('from_user_id', 'notifications_fk1').references('id').inTable('users')
    table.string('notification_type')
    table.foreign('notification_type', 'notifications_fk2').references('name').inTable('notification_types')
    table.string('status')
    table.timestamps()
  })
}

exports.down = async function (knex, Promise) {
  await knex.schema.table('notifications', function (table) {
    table.dropForeign('to_user_id', 'notifications_fk0')
    table.dropForeign('from_user_id', 'notifications_fk1')
    table.dropForeign('notification_type', 'notifications_fk2')
  })
  await knex.schema.dropTable('notifications')

  await knex.schema.dropTable('notification_types')
}
