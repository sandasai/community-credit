
exports.up = async function (knex, Promise) {
  await knex('notification_types').insert({ name: 'Request' })
  await knex('notification_types').insert({ name: 'Request Response' })
  await knex('notification_types').insert({ name: 'Item Dropoff' })
  await knex('notification_types').insert({ name: 'Item Pickup' })
  await knex('notification_types').insert({ name: 'Item Comment' })
  return knex('notification_types').insert({ name: 'Log Comment' })
}

exports.down = function (knex, Promise) {
  // need to delete notifications that are currently using these notification types
  return knex.del().from('notification_types')
    .where({ name: 'Request' })
    .orWhere({ name: 'Request Response' })
    .orWhere({ name: 'Item Dropoff' })
    .orWhere({ name: 'Item Pickup' })
    .orWhere({ name: 'Item Comment' })
    .orWhere({ name: 'Log Comment' })
}
