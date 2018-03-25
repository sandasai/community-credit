const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  name: joi.string().min(1).max(255),
  created_at: joi.any(),
  updated_at: joi.any()
})

class TagGroup extends Model {
}

TagGroup.schema = schema
TagGroup.table = 'tagGroups'

module.exports = TagGroup
