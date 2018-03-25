const __rootdir = global.__rootdir
const express = require('express')
const router = express.Router()
const Models = require(__rootdir + '/models')

// Middleware - change the status of the item to 'Available' if returned to owner
async function resetStatus (req, res, next) {
  if (req.item.holder_id === req.item.owner_id) {
    req.item.status = 'Available'
  } else {
    req.item.status = 'Unavailable'
  }
  try {
    await req.item.save()
  } catch (err) {
    return res.status(500).json(err)
  }
  next()
}

// Middleware - when a user recieves an item they requested, remove their request from the item logs
async function cancelAnyPendingRequests (req, res, next) {
  await Models.ItemLog.removeRequests(req.item.id, req.item.holder_id)
  next()
}

router.post('/item/:id/log/talk', async (req, res) => {
  let itemLog = new Models.ItemLog({
    item_log_type: 'Talk',
    user_id: req.user.id,
    item_id: req.params.id,
    comments: req.body.comments
  })
  try {
    itemLog = await itemLog.save()
    await Models.Notification.createItemLogComment(itemLog)
    return res.status(200).json(itemLog)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
})

router.post('/item/:id/log/pickup', async (req, res, next) => {
  let itemLog = new Models.ItemLog({
    item_log_type: 'Pick up',
    user_id: req.user.id,
    item_id: req.params.id,
    pickup_at: req.body.date,
    comments: req.body.comments
  })
  try {
    itemLog = await itemLog.save()
    const item = req.item
    item.holder_id = req.user.id
    req.item = await item.save()
    await Models.Notification.createItemPickup(itemLog)
    res.status(200).json(itemLog)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
  next()
}, resetStatus, cancelAnyPendingRequests)

router.post('/item/:id/log/dropoff', async (req, res, next) => {
  if (!req.body.toUser) {
    return res.status(400).json({ message: 'toUser must be specified' })
  }
  let itemLog = new Models.ItemLog({
    item_log_type: 'Drop off',
    user_id: req.user.id,
    item_id: req.params.id,
    dropoff_at: req.body.date,
    comments: req.body.comments
  })
  // change the holder of the item
  try {
    itemLog = await itemLog.save()
    const item = req.item
    item.holder_id = req.body.toUser
    req.item = await item.save()
    await Models.Notification.createItemDropoff(itemLog)
    res.status(200).json(itemLog)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
  next()
}, resetStatus, cancelAnyPendingRequests)

router.get('/item/:id/logs', async (req, res) => {
  const logs = await req.item.getLogs()
  return res.status(200).json(logs.rows)
})

router.delete('/item/:id/logs/:logId', async (req, res) => {
  const { logId } = req.params
  try {
    const results = await req.item.getLogs()
    const logs = results.rows
    if (logs[0].id === Number(logId)) {
      await Models.ItemLog.removeLog(logId)
      return res.status(200).json({})
    } else {
      return res.status(400).json({ message: 'Too late! Another log has been added. We can only remove the latest log' })
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router
