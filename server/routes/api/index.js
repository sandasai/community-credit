const axios = require('axios')
const qs = require('querystring')
const config = require('../../../config.json')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const models = require('../../models')

router.use(require('./users'))
router.use(require('./items'))
router.use(require('./requests'))
router.use(require('./notifications'))
router.use(require('./images'))

router.post('/signin', async (req, res, next) => {
  const { code, method } = req.body
  if (method === 'slack') {
    // exchange with access token
    let params = qs.stringify({
      client_id: config.slack.client_id,
      client_secret: config.slack.client_secret,
      code,
    })
    let response
    try {
      response = await axios({
        method: 'GET',
        url: `https://slack.com/api/oauth.access?${params}`
      })
      if (!response.data.ok) {
        throw new Error(`Slack error: ${response.data.error}`)
      }
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
    const { access_token, scope } = response.data
    // get identity of user
    params = qs.stringify({
      token: access_token
    })
    try {
      response = await axios({
        method: 'GET',
        url: `https://slack.com/api/users.identity?${params}`
      })
      if (!response.data.ok) {
        throw new Error(`Slack error: ${response.data.error}`)
      }
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
    const { user, team } = response.data
    const existingUser = await models.User.findBySlackUserIdTeamId(user.id, team.id)
    if (!existingUser) {
      const newUser = new models.User({
        auth_method: 'slack',
        name: user.name,
        slack_user_id: user.id,
        slack_team_id: team.id,
        slack_access_token: access_token
      })
      await newUser.save()
    } else {
      // update access token
      existingUser.access_token = access_token
      await existingUser.save()
    }
    // create a jwt with slack user_id, slack team_id
    const token = jwt.sign({
      auth_method: 'slack',
      slack_user_id: user.id,
      slack_team_id: team.id,
    }, config.jwt.secret)
    return res.status(200).json({
      token
    })
  }
})

module.exports = router
