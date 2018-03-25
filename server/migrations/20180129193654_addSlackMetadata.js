
exports.up = function (knex, Promise) {
  return knex.schema.table('users', table => {
    table.string('slack_metadata')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropColumn('slack_metadata')
  })
}
