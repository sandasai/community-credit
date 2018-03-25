const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  user_id: joi.number(),
  item_id: joi.number(),
  content: joi.string(),
  created_at: joi.any(),
  updated_at: joi.any()
})

class ItemComment extends Model {

}

ItemComment.schema = schema
ItemComment.table = 'item_comments'

module.exports = ItemComment
