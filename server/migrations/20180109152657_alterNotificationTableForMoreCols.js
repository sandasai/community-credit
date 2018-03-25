
exports.up = async function (knex, Promise) {
  await knex.schema.table('notifications', table => {
    table.dropForeign('associated_contract', 'notifications_fk3')
    table.dropColumn('associated_contract')
    table.integer('associated_item_log')
    table.foreign('associated_item_log', 'notifications_fk3').references('id').inTable('item_logs')
  })

  await knex('notification_types').insert({ name: 'Request' })
  await knex('notification_types').insert({ name: 'Request Response' })  
  await knex('notification_types').insert({ name: 'Item Dropoff' })
  await knex('notification_types').insert({ name: 'Item Pickup' })
  await knex('notification_types').insert({ name: 'Item Comment' })
  await knex('notification_types').insert({ name: 'Log Comment' })

}

exports.down = async function (knex, Promise) {
  await knex.schema.table('notiications', table => {
    table.dropForeign('associated_item_log', 'notifications_fk3')
    table.dropColumn('associated_item_log')

    table.integer('associated_contract')
    table.foreign('associated_contract', 'notifications_fk3').references('id').inTable('contracts')
  })
}
