const bookshelf = require('./db').bookshelf
bookshelf.plugin('pagination')

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
  images: function () {
    return this.hasMany(ItemImage)
  },
  associated_user: function () {
    return this.belongsTo(User, 'associated_user_id')
  },
  associated_request: function () {
    return this.belongsTo(Request, 'associated_request_id')
  },
  hasTimestamps: true
})


const ItemImage = bookshelf.Model.extend({
  tableName: 'item_images',
  item: function () {
    return this.belongsTo(Item, 'item_id', 'id')
  }
})

module.exports = {
  User, Request, Item, ItemImage
}