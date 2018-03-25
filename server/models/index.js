const Image = require('./image')
// const Item = require('./item')
const Request = require('./request')
const Tag = require('./tag')
const TagGroup = require('./tagGroup')
const User = require('./user')
const Contract = require('./contract')

module.exports = {
  Image,
  Item: require('./item'),
  Request,
  Tag,
  TagGroup,
  User,
  Contract,
  Notification: require('./notification'),
  ItemComment: require('./itemComment'),
  ItemLog: require('./itemLog'),
  Like: require('./like')
}
