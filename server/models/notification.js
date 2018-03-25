const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')
const Item = require('./item')

const schema = joi.object().keys({
  id: joi.number().optional(),
  to_user_id: joi.number(),
  from_user_id: joi.number().allow(null),
  notification_type: joi.string().min(1).max(255).allow(null).optional(),
  status: joi.string().min(1).max(255),
  created_at: joi.any(),
  updated_at: joi.any(),
  associated_request: joi.number().allow(null).optional(),
  associated_item: joi.number().allow(null).optional(),
  associated_item_log: joi.number().allow(null).optional(),
  associated_item_comment: joi.number().allow(null).optional()
})

class Notification extends Model {
  /**
   * Find items with this tag group
   * @param {number} id id of the user
   */
  static async findNotificationsForUser (id) {
    return knex.select().from('notifications').where({ to_user_id: id })
  }

  static async queryNotificationsForUser (id) {
    const query = await knex.raw(
      `
      SELECT
        notifications.id,
        notifications.updated_at AS date,
        notifications.status,
        notifications.notification_type,
        from_users.id AS from_user_id,
        from_users.first_name || ' ' || from_users.last_name AS from_user_name,
        to_json(requests) AS associated_request,
        to_json(items) AS associated_item,
        to_json(item_logs) AS associated_item_log,
        to_json(item_comments) as associated_item_comment
      FROM
        notifications
        INNER JOIN users AS to_users ON to_users.id = notifications.to_user_id
        INNER JOIN users AS from_users ON from_users.id = notifications.from_user_id
        LEFT JOIN requests ON requests.id = notifications.associated_request
        LEFT JOIN items ON items.id = notifications.associated_item
        LEFT JOIN item_logs ON item_logs.id = notifications.associated_item_log
        LEFT JOIN item_comments ON item_comments.id = notifications.associated_item_comment
      WHERE
        notifications.to_user_id = ${id} AND
        notifications.status != 'Dismissed'
      `
    )
    return query.rows
  }

  static async createRequest (itemLog) {
    const query = await Notification._queryItemLogUsers(itemLog)
    const toUserId = query.owner_id
    return new Notification({
      to_user_id: toUserId,
      from_user_id: itemLog.user_id,
      notification_type: 'Request',
      status: 'Unread',
      associated_item_log: itemLog.id,
      associated_item: itemLog.item_id
    })
  }

  static async createRequestResponse (item, toUserId, request) {
    return new Notification({
      to_user_id: toUserId,
      from_user_id: item.owner_id,
      notification_type: 'Request Response',
      status: 'Unread',
      associated_request: request.id,
      associated_item: item.id
    })
  }

  static async createItemDropoff (itemLog) {
    // get users to notify
    const query = await Notification._queryItemLogUsers(itemLog)
    const holder = query.owner_id
    const owner = query.holder_id
    const holderNotification = new Notification({
      to_user_id: holder,
      from_user_id: itemLog.user_id,
      notification_type: 'Item Dropoff',
      status: 'Unread',
      associated_item_log: itemLog.id,
      associated_item: itemLog.item_id
    })
    await holderNotification.save()

    if (holder !== owner) {
      const ownerNotification = new Notification({
        to_user_id: owner,
        from_user_id: itemLog.user_id,
        notification_type: 'Item Dropoff',
        status: 'Unread',
        associated_item_log: itemLog.id,
        associated_item: itemLog.item_id
      })
      await ownerNotification.save()
    }
  }

  static async createItemPickup (itemLog) {
    // get users to notify
    const query = await Notification._queryItemLogUsers(itemLog)
    const holder = query.owner_id
    const owner = query.holder_id
    const holderNotification = new Notification({
      to_user_id: holder,
      from_user_id: itemLog.user_id,
      notification_type: 'Item Pickup',
      status: 'Unread',
      associated_item_log: itemLog.id,
      associated_item: itemLog.item_id
    })
    await holderNotification.save()

    if (holder !== owner) {
      const ownerNotification = new Notification({
        to_user_id: owner,
        from_user_id: itemLog.user_id,
        notification_type: 'Item Pickup',
        status: 'Unread',
        associated_item_log: itemLog.id,
        associated_item: itemLog.item_id
      })
      await ownerNotification.save()
    }
  }

  static async createItemComment (itemComment) {
    const item = await Item.find(itemComment.item_id)
    const notification = new Notification({
      to_user_id: item.owner_id,
      from_user_id: itemComment.user_id,
      notification_type: 'Item Comment',
      status: 'Unread',
      associated_item_comment: itemComment.id,
      associated_item: itemComment.item_id
    })
    return notification.save()
  }

  static async createItemLogComment (itemLog) {
    const { owner_id } = await Notification._queryItemLogUsers(itemLog)
    const ownerNotification = new Notification({
      to_user_id: owner_id,
      from_user_id: itemLog.user_id,
      notification_type: 'Log Comment',
      status: 'Unread',
      associated_item_log: itemLog.id,
      associated_item: itemLog.item_id
    })
    await ownerNotification.save()
  }

  static async createLike (like) {
    const query = await knex.select().from('items').where({ 'id': like.item_id })
    const likeNotification = new Notification({
      to_user_id: query[0].owner_id,
      from_user_id: like.user_id,
      notification_type: 'Like',
      status: 'Unread',
      associated_item: like.item_id
    })
    await likeNotification.save()
  }

  static async _queryItemLogUsers (itemLog) {
    // get users to notify
    const query = await knex
      .select('items.holder_id', 'items.owner_id')
      .from('item_logs')
      .leftJoin('items', 'items.id', 'item_logs.item_id')
      .where({ 'item_logs.id': itemLog.id })
    return query[0]
  }

  async dismiss () {
    this.status = 'Dismissed'
    return this.save()
  }
}

Notification.schema = schema
Notification.table = 'notifications'

module.exports = Notification
