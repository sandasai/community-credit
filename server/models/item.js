const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  owner_id: joi.number(),
  holder_id: joi.number().allow(null),
  name: joi.string().min(1).max(255),
  description: joi.string().allow(null).allow(''),
  status: joi.string().min(1).max(255),
  created_at: joi.any(),
  updated_at: joi.any()
})

class Item extends Model {
  /**
   * Find items with this tag group
   * @param {number} id id of the user
   */
  static async findAvailableItems () {
    const items = await knex.select().from('items').where({ status: 'Available' })
    return items.rows
  }

  static async getItem (id, userId = -1000) {
    const results = await knex.raw(
      `
      SELECT 
        items.id,
        items.owner_id,
        items.holder_id,
        users.first_name || ' ' || users.last_name AS user_name,
        items.name,
        user_holders.first_name || ' ' || user_holders.last_name AS holder_name,
        items.name,
        items.description,
        items.status,
        items.updated_at AS date,
        CASE WHEN 
          (
            SELECT COUNT(*)
            FROM item_logs
            WHERE item_logs.item_log_type = 'Request' AND item_logs.user_id = ${userId} AND item_logs.item_id = ${id}
          ) > 0 THEN TRUE
          ELSE FALSE
        END AS requested,
        (
          SELECT array_to_json(array_agg(row_to_json(d)))
          FROM (
            SELECT cloudinary_public_id, cloudinary_url as url, id
            FROM images
            WHERE item_id=items.id
          ) d
        ) as images,
        (
          SELECT array_to_json(array_agg(row_to_json(d)))
          FROM (
            SELECT
              users.first_name || ' ' || users.last_name AS name,
              item_comments.updated_at AS date,
              content AS comment
            FROM item_comments
              INNER JOIN users ON users.id = item_comments.user_id
            WHERE item_id=items.id
          ) d
        ) as comments,
        (
          SELECT COUNT(*)
          FROM likes
          WHERE likes.item_id = ${id}
        ) as likes,
        CASE
          WHEN (
            SELECT COUNT(*)
            FROM likes
            WHERE likes.user_id = ${userId} AND likes.item_id = ${id}
          ) > 0
          THEN TRUE
          ELSE FALSE
        END as liked,
        (
          SELECT array_to_json(array_agg(row_to_json(d)))
          FROM (
            SELECT
              item_logs.*,
              users.first_name || ' ' || users.last_name AS user_name
            FROM
              item_logs
              INNER JOIN users ON item_logs.user_id = users.id
            WHERE item_logs.item_id = ${id}
            ORDER BY item_logs.updated_at DESC
          ) d
        ) as logs
      FROM
        items
        INNER JOIN users ON users.id = items.owner_id
        LEFT JOIN users user_holders ON user_holders.id = items.holder_id
        LEFT JOIN item_logs ON item_logs.item_id = items.id
        LEFT JOIN likes AS likes_item ON likes_item.item_id = items.id
      WHERE
        items.id = ${id}
      ORDER BY
        items.updated_at DESC
      LIMIT 1
      `
    )
    return results.rows.length === 1 ? results.rows[0] : null
  }

  static async getItems (search = null) {
    return knex.raw(
      `
      SELECT
        array_to_json(array_agg(row_to_json(t))) as results
      FROM (
        SELECT 
          items.id,
          items.owner_id,
          items.holder_id,
          items.name,
          owner.first_name || ' ' || owner.last_name AS owner_name,
          holder.first_name || ' ' || holder.last_name AS holder_name,
          items.name,
          items.description,
          items.status,
          items.updated_at AS date,
          (
            SELECT array_to_json(array_agg(row_to_json(d)))
            FROM (
              SELECT cloudinary_public_id, cloudinary_url as url
              FROM images
              WHERE item_id=items.id
            ) d
          ) as images
        FROM
          items
          INNER JOIN users AS owner ON owner.id = items.owner_id
          INNER JOIN users AS holder ON holder.id = items.holder_id
        ${search ? `WHERE items.name ILIKE '%${search}%'` : ''}          
        ORDER BY
          items.updated_at DESC
      ) t
      `
    )
  }

  /**
   * Retrieves item logs for this item sorted latest -> earliest
   */
  async getLogs () {
    return knex.raw(
      `
      SELECT
        item_logs.*,
        users.first_name || ' ' || users.last_name AS user_name
      FROM
        item_logs
        INNER JOIN users ON item_logs.user_id = users.id
      WHERE item_logs.item_id = ${this.id}
      ORDER BY item_logs.updated_at DESC
    `)
  }
}

Item.schema = schema
Item.table = 'items'

module.exports = Item
