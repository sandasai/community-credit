const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  user_id: joi.number(),
  item: joi.string().min(1).max(255),
  description: joi.string(),
  created_at: joi.any(),
  updated_at: joi.any(),
  status: joi.string().min(1).max(255),
  item_id: joi.number().allow(null).optional()
})

class Request extends Model {
  /**
   * Find all requests from a user
   * @param {number} id id of the user
   */
  static async findFromUserId (id) {
    return knex.select().from(this.table()).where({ user_id: id })
  }

  static async findWithUserName (id) {
    const requests = await knex.raw(`
    SELECT
      requests.id,
      requests.user_id,
      users.first_name || ' ' || users.last_name AS user_name,
      requests.item,
      requests.description,
      requests.updated_at AS date
    FROM
      requests
      INNER JOIN users ON users.id = requests.user_id
    WHERE
      requests.id = ${id}
    `)
    return requests.rows[0]
  }

  /**
   * Get all pending requests
   */
  static async getRequests (page = null, limit = null) {
    const results = await knex.raw(
      `
      SELECT
        requests.id,
        requests.user_id,
        users.first_name || ' ' || users.last_name AS user_name,
        requests.item,
        requests.description,
        requests.updated_at AS date
      FROM
        requests
        INNER JOIN users ON users.id = requests.user_id
      WHERE
        requests.status = 'Pending'
      ORDER BY
        requests.updated_at DESC
      ${page ? '' : 'LIMIT ' + limit + ' OFFSET ' + (limit * page)}
      `
    )
    return results.rows
  }
}

Request.schema = schema
Request.table = 'requests'

module.exports = Request
