const express = require('express')
const router = express.Router()
const Models = require('../models')

router.get('/users', async (req, res) => {
  const users = await Models.User.fetchAll({
    columns: ['id', 'name']
  })
  return res.status(200).json(users.serialize())
})

router.get('/profile', async (req, res) => {
  const { id, name, slack_scopes } = req.user.attributes
  return res.status(200).json({
    id,
    name,
    slack_scopes
  })
})

module.exports = router