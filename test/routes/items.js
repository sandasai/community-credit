const express = require('express')
const router = express.Router()
const Models = require('../models')

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
  const { name, description } = req.body;
  let item = new Models.Item({
    name,
    description,
    owner_id: req.user.id,
    holder_id: req.user.id,
    status: 'Available'
  })
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

router.delete('/items/:id', async (req, res) => {
  if (req.item.relations.owner.attributes.id !== req.user.attributes.id) {
    return res.status(401).json({})
  }
  await req.item.destroy()
  return res.status(202).json()
})

module.exports = router