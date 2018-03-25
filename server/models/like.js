const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  item_id: joi.number(),
  user_id: joi.number(),
  created_at: joi.any(),
  updated_at: joi.any()
})

class Like extends Model {
  static async get (item) {
    return knex.select().from('likes').where({ item_id: item.id })
  }

  static async alreadyLiked (itemId, userId) {
    const liked = await knex.raw(
      `
      SELECT
      CASE
        WHEN (
          SELECT COUNT(*)
          FROM likes
          WHERE likes.item_id = ${itemId} AND user_id = ${userId}
        ) > 0 
        THEN TRUE
        ELSE FALSE
      END
      `
    )
    return liked.rows[0].case
  }
}

Like.schema = schema
Like.table = 'likes'

module.exports = Like
