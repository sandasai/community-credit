const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  first_name: joi.string().alphanum().required(),
  last_name: joi.string().alphanum().required(),
  password: joi.string().allow(null).allow('').optional(),
  slack_metadata: joi.string().allow(null).allow('').optional(),
  authServiceType: joi.string().allow(null).allow('').optional(),
  email: joi.string().email(),
  phone: joi.string().allow(null).allow('').optional(),
  created_at: joi.any(),
  updated_at: joi.any()
})

/**
 * User model
 */
class User extends Model {
  /**
   * Find a single user by email
   * @param {*} email email of the user
   * @returns {User}
   */
  static async findByEmail (email) {
    const result = await knex('users').where({ email }).limit(1)
    if (!result || result.length === 0) {
      return null
    } else {
      return new User(result[0])
    }
  }
}

User.table = 'users'
User.schema = schema

module.exports = User
