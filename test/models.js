const bookshelf = require('./db').bookshelf

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true
})

const Request = bookshelf.Model.extend({
  tableName: 'requests',
  user: function () {
    return this.belongsTo(User)
  },
  hasTimestamps: true
})

module.exports = {
  User, Request
}