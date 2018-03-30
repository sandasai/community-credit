const express = require('express')
const router = express.Router()
const Models = require('../models')
const formidable = require('formidable')
const CloudinaryService = require('../cloudinary')

router.get('/items', async (req, res) => {
  const items = await Models.Item.fetchAll({
    withRelated: [
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
  return res.status(200).json(items.serialize())
})

router.post('/items', async (req, res) => {
  const { name, description, user_id, request_id } = req.body;
  console.log(name)
  let item = new Models.Item({
    name,
    description,
    owner_id: req.user.id,
    holder_id: req.user.id,
  })
  if (user_id || user_id === 0) {
    const associatedUser = await Models.User.where({ id: user_id }).fetch()
    if (!associatedUser) {
      return res.status(400).json({ message: 'Invalid user_id' })
    }
    item.set('associated_user_id', user_id)
  }
  if (request_id || request_id === 0) {
    const associatedRequest = await Models.Request.where({ id: request_id }).fetch()
    if (!associatedRequest) {
      return res.status(400).json({ message: 'Invalid request_id' })
    }
    item.set('associated_request_id', request_id)
  }
  item.set('status', ((user_id || user_id === 0) ? 'Unavailable' : 'Available'))
  item = await item.save()
  item = await Models.Item.where({ id: item.id }).fetch({
    withRelated: [
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
  return res.status(201).json(item.serialize())
})

router.use('/items/:id', async (req, res, next) => {
  const itemId = req.params.id
  const { name, description } = req.body;
  let item = await Models.Item.where({ id: itemId }).fetch()
  if (!item) {
    return res.status(404).json({ message: 'No item found' })
  }
  item = await Models.Item.where({ id: item.id }).fetch({
    withRelated: [
      'images',
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
    ]
  })
  req.item = item
  next()
})

router.get('/items/:id', async (req, res) => {
  return res.status(200).json(req.item.serialize())
})

router.put('/items/:id', async (req, res) => {
  if (req.item.relations.owner.attributes.id !== req.user.attributes.id) {
    return res.status(401).json({})
  }
  let item = req.item
  const { name, description } = req.body;
  item = await item.save({
    name,
    description
  }, { patch: true })
  item = await Models.Item.where({ id: item.id }).fetch({
    withRelated: [
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
  return res.status(201).json(item.serialize())
})

router.post('/items/:id/images', async (req, res) => {
  const item = req.item
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    if (err) {
      return res.status(400).json(err)
    }
    console.log(files)
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

module.exports = router