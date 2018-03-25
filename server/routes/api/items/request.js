const __rootdir = global.__rootdir
const express = require('express')
const router = express.Router()
const Models = require(__rootdir + '/models')
const knex = require(__rootdir + '/db')

router.post('/item/:id/request', async (req, res) => {
  const item = req.item

  if (req.body.set) {
    if (!item.status.toUpperCase().includes('AVAILABLE')) {
      return res.status(400).json({
        message: 'Item is already taken'
      })
    }
    let itemLog = new Models.ItemLog({
      user_id: req.user.id,
      item_id: req.params.id,
      item_log_type: 'Request'
    })
    try {
      itemLog = await itemLog.save()
      let notification = await Models.Notification.createRequest(itemLog)
      await notification.save()
      return res.status(200).json()
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  } else {
    // TODO: Additional check?
    const itemLogRequest = await knex.select().from('item_logs').where({
      item_log_type: 'Request',
      user_id: req.user.id,
      item_id: req.params.id
    })
    if (itemLogRequest.length > 0) {
      itemLogRequest.forEach(async (itemLog) => {
        await knex.del().from('notifications').where({
          associated_item_log: itemLog.id
        })
      })
      await knex.del().from('item_logs').where({
        item_log_type: 'Request',
        user_id: req.user.id,
        item_id: req.params.id
      })
      return res.status(200).json()
    }
    return res.status(404).json()
  }
})

module.exports = router
