const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  item_id: joi.number(),
  borrower_id: joi.number().allow(null),
  sharer_id: joi.number(),
  status: joi.string(),
  item_taken: joi.date().allow(null),
  item_returned: joi.date().allow(null),
  created_at: joi.any(),
  updated_at: joi.any()
})

class ContractMessages extends Model {

}

ContractMessages.schema = schema
ContractMessages.table = 'contractMessages'

module.exports = ContractMessages
