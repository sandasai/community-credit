const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  user_id: joi.number(),
  item_id: joi.number(),
  item_log_type: joi.string().min(1).max(255).required(),
  dropoff_at: joi.date().allow(null).optional(),
  pickup_at: joi.date().allow(null).optional(),
  comments: joi.string().allow(null).allow('').optional(),
  created_at: joi.any(),
  updated_at: joi.any()
})

class ItemLog extends Model {
  /**
   * Validates whether or not the user can do the following action
   * @param {number} id User id
   * Returns true if the action can be done
   */
  static async validateAction (userId, itemId, action) {
    let item = knex.select().from('items').where({ id: itemId })
    if (!item.rows[0]) {
      throw new Error('Item not found')
    }
    item = item.rows[0]

    switch (action) {
      case 'talk':
        return true
      case 'request':
        return item.status.toUpperCase().includes('AVAILABLE')
      case 'dropoff':
        return item.holder_id === userId
      case 'pickup':
        return item.holder_id !== userId
      default:
        return false
    }
  }

  /**
   * Removes the item log
   * @param {number} id of the itemLog
   */
  static async removeLog (id) {
    return knex.del().from('item_logs').where({ id })
  }

  static async removeRequests (itemId, userId) {
    return knex.del().from('item_logs').where({ 'user_id': userId, 'item_id': itemId, 'item_log_type': 'Request' })
  }
}

ItemLog.schema = schema
ItemLog.table = 'item_logs'

module.exports = ItemLog
