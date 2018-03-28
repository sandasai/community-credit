const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  name: joi.string().required(),
  password: joi.string().allow(null).allow('').optional(),
  email: joi.string().email().optional().allow(null).allow(''),
  auth_method: joi.string(),
  slack_user_id: joi.string().optional(),
  slack_team_id: joi.string().optional(),
  slack_access_token: joi.string().optional(),
  created_at: joi.any(),
  updated_at: joi.any()
})

/**
 * User model
 */
class User extends Model {
  /**
   * Find a single user by email
   * @param {String} email email of the user
   * @returns {User}  User database object
   */
  static async findByEmail (email) {
    const results = await knex.raw(`
      SELECT * FROM users WHERE email = '${email}'
    `)
    if (!results.rows[0]) {
      return null
    }
    return new User(results.rows[0])
  }

  /**
   * Find a single user by slack user id and team id
   * @param {String} userId Slack user id
   * @param {String} teamId Slack team id
   */
  static async findBySlackUserIdTeamId (userId, teamId) {
    const results = await knex.raw(`
      SELECT * FROM users WHERE slack_user_id = '${userId}' AND slack_team_id = '${teamId}'
    `)
    if (!results.rows[0]) {
      return null
    }
    return new User(results.rows[0])
  }
}

User.table = 'users'
User.schema = schema

module.exports = User
