const express = require('express')
const router = express.Router()
const Models = require('../models')
const slack = require('../slack')
const config = require('../../config')

router.get('/requests', async (req, res) => {
  const requests = await Models.Request.where({ status: 'pending' }).fetchAll({
    withRelated: [
      {
        'user': function (query) {
          query.column('id', 'name', 'email')
        }
      }
    ]
  })
  return res.status(200).json(requests.serialize())
})

router.post('/requests', async (req, res) => {
  const { item, description } = req.body;
  let request = new Models.Request({
    item,
    description,
    user_id: req.user.id,
    status: 'pending'
  })
  request = await request.save()
  request = await Models.Request.where({ id: request.id }).fetch({
    withRelated: [
      {
        'user': function (query) {
          query.column('id', 'name', 'email')
        }
      }
    ]
  })
  await slack.postRequest(req.user.attributes.name, item, `${config.domain}/requests/${request.attributes.id}`)
  return res.status(201).json(request.serialize())
})

router.use('/requests/:id', async (req, res, next) => {
  const requestId = req.params.id
  const { item, description } = req.body;
  let request = await Models.Request.where({ id: requestId }).fetch()
  if (!request) {
    return res.status(404).json({ message: 'No request found' })
  }
  request = await Models.Request.where({ id: request.id }).fetch({
    withRelated: [
      {
        'user': function (query) {
          query.column('id', 'name', 'email')
        }
      }
    ]
  })
  req.request = request
  next()
})

router.get('/requests/:id', async (req, res) => {
  return res.status(200).json(req.request.serialize())
})

router.put('/requests/:id', async (req, res) => {
  if (req.request.relations.user.attributes.id !== req.user.attributes.id) {
    return res.status(401).json({})
  }
  let request = req.request
  const { item, description } = req.body;
  request = await request.save({
    item,
    description
  }, { patch: true })
  request = await Models.Request.where({ id: request.id }).fetch({
    withRelated: [
      {
        'user': function (query) {
          query.column('id', 'name', 'email')
        }
      }
    ]
  })
  return res.status(201).json(request.serialize())
})

router.delete('/requests/:id', async (req, res) => {
  if (req.request.relations.user.attributes.id !== req.user.attributes.id) {
    return res.status(401).json({})
  }
  await req.request.destroy()
  return res.status(202).json()
})

module.exports = router