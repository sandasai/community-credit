const axios = require('axios')
const qs = require('querystring')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const Models = require('../models')
const bearerToken = require('express-bearer-token')

router.post('/auth/signin', async (req, res, next) => {
  let scopes

  const { code, method } = req.body
  if (method === 'slack') {
    // exchange with access token
    let params = qs.stringify({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code,
      redirect_uri: process.env.BASE_URL
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
      scopes = response.data.scope
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
      console.log(scopes, response.data)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
    const { user, team } = response.data
    let userId, userName;
    const existingUser = await Models.User.where({ 'slack_user_id': user.id, 'slack_team_id': team.id }).fetch()
    if (!existingUser) {
      const newUser = new Models.User({
        auth_method: 'slack',
        name: user.name,
        slack_user_id: user.id,
        slack_team_id: team.id,
        slack_access_token: access_token,
        slack_scopes: scopes
      })
      await newUser.save()
      userId = newUser.attributes.id
      userName = newUser.attributes.name
    } else {
      // update access token
      existingUser.save({
        'slack_access_token': access_token,
        'slack_scopes': scopes
       }, { patch: true })
      userId = existingUser.attributes.id
      userName = existingUser.attributes.name
    }
    // create a jwt with slack user_id, slack team_id
    const token = jwt.sign({
      auth_method: 'slack',
      slack_user_id: user.id,
      slack_team_id: team.id,
    }, process.env.JWT_SECRET)
    return res.status(200).json({
      token,
      id: userId,
      name: userName
    })
  }
})

// Middleware validates whether user sent JWT for authenticating requests
// Attached the User model to the request object
const checkLoggedIn = [
  bearerToken(),
  async (req, res, next) => {
    const { token } = req
    try {
      const { auth_method, slack_user_id, slack_team_id } = await jwt.verify(token, process.env.JWT_SECRET)
      req.user = await Models.User.where({ auth_method, slack_user_id, slack_team_id }).fetch()
      // If the user no longer has access token, then they are logged out and need to sign back in
      if (!req.user.attributes.slack_access_token || req.user.attributes.slack_access_token.length <= 0) {
        throw new Error()
      }
      next()
    } catch (err) {
      return res.status(401).json({
        message: 'You must have a valid login'
      })
    }
  }
]

router.post('/auth/logout', ...checkLoggedIn, async (req, res) => {
  try {
    const params = qs.stringify({
      token: req.user.attributes.slack_access_token
    })
    const response = await axios({
      method: 'GET',
      url: `https://slack.com/api/auth.revoke?${params}`
    })
    if (!response.data.ok) {
      console.log(response.data.error)
      return res.status(500).json({})
    }
    await req.user.save({ slack_access_token: null }, { patch: true })
    return res.status(200).json({})
  } catch (err) {
    console.log(err)
    return res.status(500).json(err.response.data)
  }
})

router.use('/api', ...checkLoggedIn)
router.use('/api', require('./requests'))
router.use('/api', require('./items'))
router.use('/api', require('./users'))

module.exports = router
