const __rootdir = global.__rootdir
const express = require('express')
const router = express.Router()
const Request = require(__rootdir + '/models/request')
const knex = require(__rootdir + '/db')

router.post('/request', async (req, res) => {
  const { item, description } = req.body
  let request = new Request({ item, description, user_id: req.user.id, status: 'Pending' })
  try {
    request = await request.save()
    return res.status(200).json(request)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
})

router.get('/requests', async (req, res) => {
  try {
    const requests = await Request.getRequests()
    return res.status(200).json(requests)
  } catch (err) {
    console.log(err)
    return res.status(504).json({
      success: false,
      errors: err
    })
  }
})

router.get('/request/:id', async (req, res) => {
  try {
    const request = await Request.findWithUserName(req.params.id)
    if (!request) {
      return res.status(404).json()
    } else {
      return res.status(200).json(request)
    }
  } catch (err) {
    return res.status(504).json(err)
  }
})

router.put('/request/:id', async (req, res) => {
  try {
    const request = await Request.find(req.params.id)
    if (!request) {
      return res.status(404)
    } else {
      const { item, description } = req.body
      request.item = item
      request.description = description
      if (Number(request.user_id) !== Number(req.user.id)) {
        return res.status(403).json({ message: 'You are not authorized' })
      }
      const result = await request.save()
      return res.status(200).json(result)
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: err.detail
    })
  }
})

router.delete('/request/:id', async (req, res) => {
  try {
    const request = await Request.find(req.params.id)
    if (!request) {
      return res.status(404).json({ message: 'Request does not exist' })
    } else {
      await knex.del().from('requests').where({ id: request.id })
      return res.status(200).json({})
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router
