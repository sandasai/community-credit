
exports.up = async function (knex, Promise) {
  await knex.schema.createTable('items', function (table) {
    table.increments()
    table.integer('owner_id').notNullable()
    table.foreign('owner_id', 'items_fk0').references('id').inTable('users')
    table.integer('holder_id')
    table.foreign('holder_id', 'items_fk1').references('id').inTable('users')
    table.string('name')
    table.text('description')
    table.string('status')
    table.timestamps()
  })

  await knex.schema.createTable('images', function (table) {
    table.increments()
    table.integer('width')
    table.integer('height')
    table.string('format')
    table.integer('bytes')
    table.string('cloudinary_public_id')
    table.string('cloudinary_version')
    table.string('cloudinary_url')
    table.integer('item_id')
    table.foreign('item_id', 'images_fk0').references('id').inTable('items')
    table.timestamps()
  })

  await knex.schema.createTable('tagGroups', function (table) {
    table.increments()
    table.string('name')
    table.timestamps()
  })

  await knex.schema.createTable('tags', function (table) {
    table.increments()
    table.integer('tagGroup_id').notNullable()
    table.foreign('tagGroup_id', 'tags_fk0').references('id').inTable('tagGroups')
    table.integer('item_id').notNullable()
    table.foreign('item_id', 'tags_fk1').references('id').inTable('items')
    table.timestamps()
  })
}

exports.down = async function (knex, Promise) {
  await knex.schema.table('tags', function (table) {
    table.dropForeign('tagGroup_id', 'tags_fk0')
    table.dropForeign('item_id', 'tags_fk1')
  })
  await knex.schema.dropTable('tags')

  await knex.schema.dropTable('tagGroups')

  await knex.schema.table('images', function (table) {
    table.dropForeign('item_id', 'images_fk0')
  })
  await knex.schema.dropTable('images')

  await knex.schema.table('items', function (table) {
    table.dropForeign('owner_id', 'items_fk0')
    table.dropForeign('holder_id', 'items_fk1')
  })

  await knex.schema.dropTable('items')
}
