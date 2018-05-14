
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('slack_scopes')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('slack_scopes')
  })
};
