const __rootdir = global.__rootdir
const express = require('express')
const router = express.Router()
const Models = require(__rootdir + '/models')
const knex = require(__rootdir + '/db')

router.use('/notification/:id', async (req, res, next) => {
  const notification = await Models.Notification.find(req.params.id)
  if (!notification) {
    return res.status(404).json({ message: 'notification not found' })
  }
  req.notification = notification
  next()
})

router.get('/notifications', async (req, res) => {
  const notifications = await Models.Notification.queryNotificationsForUser(req.user.id)
  return res.status(200).json(notifications)
})

router.put('/notification/:id', async (req, res) => {
  let { dismiss } = req.body
  let notification = req.notification
  if (dismiss) {
    notification = await notification.dismiss()
  }
  return res.status(200).json(notification)
})

module.exports = router
