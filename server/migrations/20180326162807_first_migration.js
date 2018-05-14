
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments()
    table.string('name').notNullable()
    table.string('email').unique()
    table.string('password')
    table.string('auth_method').notNullable()
    table.string('slack_user_id')
    table.string('slack_team_id')
    table.string('slack_access_token')
    table.timestamps()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
