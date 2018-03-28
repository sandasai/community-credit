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

const Item = bookshelf.Model.extend({
  tableName: 'items',
  owner: function () {
    return this.belongsTo(User, 'owner_id')
  },
  holder: function () {
    return this.belongsTo(User, 'holder_id')
  },
  hasTimestamps: true
})

module.exports = {
  User, Request, Item
}