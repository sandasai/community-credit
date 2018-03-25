const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  tagGroup_id: joi.number(),
  item_id: joi.number(),
  created_at: joi.any(),
  updated_at: joi.any()
})

class Tag extends Model {
}

Tag.schema = schema
Tag.table = 'tags'

module.exports = Tag
