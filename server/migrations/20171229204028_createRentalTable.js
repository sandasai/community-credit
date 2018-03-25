
exports.up = async function (knex, Promise) {
  await knex.schema.createTable('contractStatuses', function (table) {
    table.increments()
    table.string('name').unique()
    table.timestamps()
  })

  await knex('contractStatuses').insert({ name: 'Requested' })
  await knex('contractStatuses').insert({ name: 'Agreed' })
  await knex('contractStatuses').insert({ name: 'Item Taken' })
  await knex('contractStatuses').insert({ name: 'Item Returned' })
  await knex('contractStatuses').insert({ name: 'Completed' })

  await knex.schema.createTable('contracts', function (table) {
    table.increments()
    table.integer('item_id')
    table.integer('borrower_id')
    table.integer('sharer_id')
    table.string('status')
    table.timestamps()
    table.dateTime('item_taken')
    table.dateTime('item_returned')

    table.foreign('status', 'contracts_fk0').references('name').inTable('contractStatuses')
    table.foreign('borrower_id', 'contracts_fk1').references('id').inTable('users')
    table.foreign('sharer_id', 'contracts_fk2').references('id').inTable('users')
    table.foreign('item_id', 'contracts_fk3').references('id').inTable('items')
  })
}

exports.down = async function (knex, Promise) {
  await knex.schema.table('contracts', function (table) {
    table.dropForeign('status', 'contracts_fk0')
    table.dropForeign('borrower_id', 'contracts_fk1')
    table.dropForeign('sharer_id', 'contracts_fk2')
    table.dropForeign('item_id', 'contracts_fk3')
  })
  await knex.schema.dropTable('contracts')

  await knex.schema.dropTable('contractStatuses')
}
