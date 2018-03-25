const __rootdir = global.__rootdir
const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const CloundinaryService = require(__rootdir + '/services/cloudinary')
const Models = require(__rootdir + '/models')
const Slack = require('../../../services/slack')

// Middleware

// Verifies that the item exists on any request with id
router.use('/item/:id', async function (req, res, next) {
  let item = await Models.Item.find(req.params.id)
  if (!item) {
    return res.status(404).json({ message: 'Item does not exist' })
  }
  req.item = item
  next()
})

// Reusable middleware for verifying item owner matches the requesting user
async function VerifyItemOwnerMatchesRequester (req, res, next) {
  if (Number(req.item.owner_id) !== Number(req.user.id)) {
    return res.status(403).json()
  }
  next()
}

// End Routes

router.post('/item', async (req, res) => {
  const form = new formidable.IncomingForm()

  // parse the incoming request containing the form data
  form.parse(req, async function (err, fields, files) {
    if (err) {
      return res.status(404).json({
        success: false,
        errors: err
      })
    }
    const { name, description, request } = fields
    let user = fields.user
    console.log(user)
    if (user) {
      user = await Models.User.find(user)
    }
    let requestId = request
    // Create item objects`
    let item = new Models.Item()
    item.owner_id = req.user.id
    item.holder_id = req.user.id
    item.name = name || ''
    item.description = description || ''
    item.status = user ? 'Reserved' : 'Available'
    try {
      item = await item.save()
      // If user is specified, create a notification
      if (user && request) {
        let requestDb = await Models.Request.find(requestId)
        if (!requestDb) {
          return res.status(500).json()
        }
        requestDb.status = 'Fulfilled'
        requestDb.item_id = item.id
        requestDb = await requestDb.save()
        const notification = await Models.Notification.createRequestResponse(item, user.id, requestDb)
        await notification.save()

        // Sends slack message between users about new item posted (if they have added to slack)
        await Slack.sendItemListMsg(item.name, req.user, user)
      }

      const itemLog = new Models.ItemLog({
        user_id: req.user.id,
        item_id: item.id,
        item_log_type: 'Created'
      })
      await itemLog.save()
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
    const fileKeys = Object.keys(files)
    fileKeys.forEach(async (fileKey) => {
      const file = files[fileKey]
      // upload to cloudinary, save image objects
      const result = await CloundinaryService.uploadImageFile(file)
      const { public_id, version, width, height, format, bytes, url } = result
      const image = new Models.Image({
        width,
        height,
        format,
        bytes,
        cloudinary_public_id: public_id,
        cloudinary_version: String(version),
        cloudinary_url: url,
        item_id: item.id
      })
      try {
        await image.save()
      } catch (err) {
        res.status(400).json(err)
      }
    })

    const savedItem = await Models.Item.getItem(item.id)
    return res.status(200).json(savedItem)
  })
})

router.put('/item/:id', VerifyItemOwnerMatchesRequester, async (req, res) => {
  let item = req.item
  item.name = req.body.name || req.item.name
  item.description = req.body.description || req.item.name
  item.status = req.body.status || req.item.status
  try {
    item = await item.save()
    return res.status(200).json(item)
  } catch (err) {
    return res.status(400).json(err)
  }
})

router.use('/item/:id', require('./like'))

router.post('/item/:id/image', async (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    if (err) {
      return res.status(404).json(err)
    }
    const fileKeys = Object.keys(files)
    fileKeys.forEach(async (fileKey) => {
      const file = files[fileKey]
      // upload to cloudinary, save image objects
      const result = await CloundinaryService.uploadImageFile(file)
      const { public_id, version, width, height, format, bytes, url } = result
      let image = new Models.Image({
        width,
        height,
        format,
        bytes,
        cloudinary_public_id: public_id,
        cloudinary_version: String(version),
        cloudinary_url: url,
        item_id: req.params.id
      })
      try {
        image = await image.save()
        return res.status(200).json(image)
      } catch (err) {
        return res.status(400).json(err)
      }
    })
  })
})

router.use('/', require('./request'))
router.use('/', require('./log'))

router.get('/items', async (req, res) => {
  const { search } = req.query
  try {
    const results = await Models.Item.getItems(search)
    return res.status(200).json(results.rows[0].results || [])
  } catch (err) {
    console.log(err)
    return res.status(504).json(err)
  }
})

router.get('/item/:id', async (req, res) => {
  const item = await Models.Item.getItem(req.params.id, req.user.id)
  try {
    return res.status(200).json(item)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.post('/item/:id/comment', async (req, res) => {
  try {
    let itemComment = new Models.ItemComment({
      user_id: req.user.id,
      item_id: req.params.id,
      content: req.body.comment
    })
    itemComment = await itemComment.save()
    await Models.Notification.createItemComment(itemComment)
    return res.status(200).json(itemComment)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

module.exports = router
