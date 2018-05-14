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
  likes: function () {
    return this.hasMany(ItemLike)
  },
  requests: function () {
    return this.hasMany(ItemRequest)
  },
  logs: function () {
    return this.hasMany(ItemLog)
  },
  hasTimestamps: true,
  liked: async function (user_id) {
    const itemLike = await ItemLike.where({ user_id, item_id: this.attributes.id }).fetch()
    return itemLike ? true : false
  },
  requested: async function (user_id) {
    const itemRequest = await ItemRequest.where({ user_id, item_id: this.attributes.id }).fetch()
    return itemRequest ? true : false
  },
  serializeFull: async function (user_id) {
    return {
      ...this.serialize(),
      liked: await this.liked(user_id),
      requested: await this.requested(user_id)
    }
  }
})


const ItemImage = bookshelf.Model.extend({
  tableName: 'item_images',
  item: function () {
    return this.belongsTo(Item, 'item_id', 'id')
  },
  hasTimestamps: true
})

const ItemLike = bookshelf.Model.extend({
  tableName: 'item_likes',
  user: function () {
    return this.belongsTo(User, 'user_id', 'id')
  },
  item: function () {
    return this.belongsTo(Item, 'item_id', 'id')
  },
  hasTimestamps: true
})

const ItemRequest = bookshelf.Model.extend(({
  tableName: 'item_requests',
  user: function () {
    return this.belongsTo(User, 'user_id', 'id')
  },
  item: function () {
    return this.belongsTo(Item, 'item_id', 'id')
  },
  hasTimestamps: true
}))

const ItemLog = bookshelf.Model.extend(({
  tableName: 'item_logs',
  user: function () {
    return this.belongsTo(User, 'user_id', 'id')
  },
  item: function () {
    return this.belongsTo(Item, 'item_id', 'id')
  },
  hasTimestamps: true
}))

module.exports = {
  User, Request, Item, ItemImage, ItemLike, ItemRequest, ItemLog
}