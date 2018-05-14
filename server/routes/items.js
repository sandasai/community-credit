const express = require('express')
const router = express.Router()
const Models = require('../models')
const formidable = require('formidable')
const CloudinaryService = require('../cloudinary')
const slack = require('../slack')
const util = require('./util')
const moment = require('moment')

async function fetchItem (id) {
  return Models.Item.where({ id }).fetch({
    withRelated: [
      'images',
      'likes',
      'requests',
      'logs',
      {
        'logs.user': function (query) { // nested relationships with '.'
          query.column('id', 'name', 'email')
        }
      },
      {
        'owner': function (query) {
          query.column('id', 'name', 'email')
        }
      },
      {
        'holder': function (query) {
          query.column('id', 'name', 'email')
        }
      }
    ]
  })
}

router.get('/items', async (req, res) => {
  const { page, search } = req.query
  const items = await Models.Item.query(function (qb) {
      qb.orderBy('updated_at', 'DESC');
      if (search) {
        qb.whereRaw(`"name" ILIKE '%${search}%'`)
      }
    }).fetchPage({
      pageSize: 16,
      page: page || 1,
      withRelated: [
        'images',
        'likes',
        {
          'owner': function (query) {
            query.column('id', 'name', 'email')
          }
        },
        {
          'holder': function (query) {
            query.column('id', 'name', 'email')
          }
        },
      ],
  })
  const itemsSerialized = items.models.map(model => {
    return model.serialize()
  })
  return res.status(200).json(itemsSerialized)
})

router.post('/items', async (req, res) => {
  const { name, description, user_id, request_id } = req.body;
  let item = new Models.Item({
    name,
    description,
    owner_id: req.user.id,
    holder_id: req.user.id,
  })
  let associatedUser

  // user specified the item for aother user
  if (user_id || user_id === 0) {
    associatedUser = await Models.User.where({ id: user_id }).fetch()
    if (!associatedUser) {
      return res.status(400).json({ message: 'Invalid user_id' })
    }
    item.set('associated_user_id', user_id)
  }

  // this item is associated with a request
  if (request_id || request_id === 0) {
    const associatedRequest = await Models.Request.where({ id: request_id }).fetch()
    if (!associatedRequest) {
      return res.status(400).json({ message: 'Invalid request_id' })
    }
    item.set('associated_request_id', request_id)
    associatedRequest.set('status', 'fulfilled')
    await associatedRequest.save()
  }

  item.set('status', ((user_id || user_id === 0) ? 'Unavailable' : 'Available'))
  item = await item.save()
  item = await fetchItem(item.id)

  if (process.env.NODE_ENV !== 'test') {
    await slack.postNewItem(
      req.user,
      name,
      `${util.getAbsBaseUrl(req)}#/items/${item.id}`,
      description,
      undefined,
      associatedUser
    )
  }

  return res.status(201).json(item.serialize())
})

router.use('/items/:id', async (req, res, next) => {
  const itemId = req.params.id
  const { name, description } = req.body;
  let item = await fetchItem(itemId)
  if (!item) {
    return res.status(404).json({ message: 'No item found' })
  }
  req.item = item
  next()
})

router.get('/items/:id', async (req, res) => {
  return res.status(200).json(await req.item.serializeFull(req.user.attributes.id))
})

router.put('/items/:id', async (req, res) => {
  if (req.item.relations.owner.attributes.id !== req.user.attributes.id) {
    return res.status(401).json({})
  }
  let item = req.item
  const { name, description, status } = req.body;
  item = await item.save({
    name,
    description,
    status
  }, { patch: true })
  item = await fetchItem(item.id)
  return res.status(201).json(await req.item.serializeFull(req.user.attributes.id))
})

router.post('/items/:id/images', async (req, res) => {
  const item = req.item
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    if (err) {
      return res.status(400).json(err)
    }
    const fileKeys = Object.keys(files)
    try {
      for (let fileKey of fileKeys) {
        const file = files[fileKey]
        // upload to cloudinary, save image objects
        const result = await CloudinaryService.uploadImageFile(file)
        const { width, height, format, bytes, url, public_id } = result
        const image = new Models.ItemImage({
          width,
          height,
          format,
          bytes,
          url,
          remote_id: public_id,
          item_id: item.id
        })
        await image.save()
      }
    } catch (err) {
      return res.status(400).json(err)
    }
    const itemImages = await Models.ItemImage.where({ item_id: item.id }).fetchAll()
    return res.status(200).json(itemImages.serialize())
  })
})

router.delete('/items/:id/images/:imageId', async (req, res) => {
  const image = await Models.ItemImage.where({ id: req.params.imageId }).fetch();
  if (image) {
    await image.destroy()
    return res.status(202).json()
  } else {
    return res.status(404).json({ message: 'Image does not exist '})
  }
})

router.delete('/items/:id', async (req, res) => {
  if (req.item.relations.owner.attributes.id !== req.user.attributes.id) {
    return res.status(401).json({})
  }
  await req.item.destroy()
  return res.status(202).json()
})

router.post('/items/:id/likes', async (req, res) => {
  let itemLike = await Models.ItemLike.where({
    user_id: req.user.attributes.id,
    item_id: req.item.attributes.id
  }).fetch()
  if (itemLike) {
    return res.status(400).json({ message: 'Already liked item' })
  }
  // check if user has already liked it
  itemLike = new Models.ItemLike({
    user_id: req.user.id,
    item_id: req.item.id
  })
  itemLike = await itemLike.save()
  return res.status(201).json(itemLike.serialize())
})

router.delete('/items/:id/likes', async (req, res) => {
  let itemLike = await Models.ItemLike.where({
    user_id: req.user.attributes.id,
    item_id: req.item.attributes.id
  }).fetch()
  if (!itemLike) {
    return res.status(400).json({ message: 'You didn\'t liked the item' })
  }
  await itemLike.destroy()
  return res.status(204).json()
})

router.post('/items/:id/requests', async (req, res) => {
  let item = req.item
  const user = req.user
  if (item.attributes.owner_id === user.attributes.id) {
    return res.status(400).json({ message: 'You can\t request your own item' })
  }
  if (await item.requested(user.id)) {
    return res.status(400).json({ message: 'You already requested this item' })
  }
  const itemRequest = new Models.ItemRequest({
    user_id: user.id,
    item_id: item.id
  })
  await itemRequest.save()
  item = await fetchItem(item.id)

  // post to slack
  const owner = await Models.User.where({ id: item.attributes.owner_id }).fetch()
  try {
    await slack.postItemRequest(owner, user, item.attributes.name, `${util.getAbsBaseUrl(req)}#/items/${item.id}`)
  } catch (err) {
    console.log(err)
    return res.status(400).json()
  }
  return res.status(201).json(await item.serializeFull(user.attributes.id))
})

router.delete('/items/:id/requests', async (req, res) => {
  const itemRequests = await Models.ItemRequest.where(
    {
      user_id: req.user.attributes.id,
      item_id: req.item.attributes.id
    }
  ).destroy()
  return res.status(204).json({})
})

router.post('/items/:id/transfer', async (req, res) => {
  const { user_id, message, date } = req.body
  if (!user_id) {
    return res.status(400).json({ message: 'Please specify a user'})
  }
  const user = await Models.User.where({ id: user_id }).fetch();  // User who will recieve item
  if (!user) {
    return res.status(400).json({ message: 'No user exists' })
  }
  let itemLog = new Models.ItemLog({
    type: 'transfer',
    item_id: req.item.attributes.id,
    user_id: req.user.attributes.id,  // User who posted the log
    message: `${user.attributes.name} recieved ${req.item.attributes.name} from ${req.item.relations.holder.attributes.name}`,
    user_message: message
  })
  await itemLog.save()
  // update the item
  let item = req.item

  const previousHolder = await Models.User.where({ id: item.attributes.holder_id }).fetch()

  item.set('holder_id', user.id)
  if (user.id !== req.item.attributes.owner_id) {
    item.set('status', 'Unavailable')
  } else {
    item.set('status', 'Availalble')
  }
  await item.save()

  if (process.env.NODE_ENV !== 'test') {
    const newHolder = await Models.User.where({ id: item.attributes.holder_id }).fetch()
    const owner = await Models.User.where({ id: item.attributes.owner_id }).fetch()
    await slack.postItemActivity(
      owner,
      previousHolder,
      newHolder,
      item.attributes.name,
      `${util.getAbsBaseUrl(req)}items/${item.id}`,
      moment(date).format('MMMM Do YYYY, h:mm:ss a')
    )
  }

  return res.status(200).json({})
})

router.post('/items/:id/comments', async (req, res) => {
  const { comments } = req.body
  if (!comments || comments.length === 0) {
    return res.status(400).json({ message: 'User must include comments'})
  }
  let itemLog = new Models.ItemLog({
    type: 'comment',
    item_id: req.item.attributes.id,
    user_id: req.user.attributes.id,
    user_message: comments,
    message: `${req.user.attributes.name} commented: ${comments}`
  })
  await itemLog.save()
  return res.status(200).json({})
})

router.delete('/items/:id/comments/:itemLogId', async (req, res) => {
  const itemLog = await Models.ItemLog.where({ id: req.params.itemLogId, type: 'comment' }).fetch();
  if (!itemLog) {
    return res.status(404).json({ message: 'No item comment exists'})
  }
  if (req.user.attributes.id !== req.item.owner_id && req.user.attributes.id !== itemLog.attributes.user_id) {
    return res.status(400).json({ message: 'You are not authorized to delete the comment'})
  }
  await itemLog.destroy()
  return res.status(204).json({})
})

module.exports = router