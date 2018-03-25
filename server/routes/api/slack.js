const express = require('express')
const router = express.Router()
const slack = require('../../services/slack')

/**
 * Route for authorizing User slack access. Gathers the access_token and stores it in DB.
 */
router.post('/addtoslack', async (req, res) => {
  const { code } = req.body
  try {
    const { user_id, team_id, access_token, scopes } = await slack.getAccessToken(code)
    let userDb = req.user
    userDb.slack_metadata = JSON.stringify({ user_id, team_id, access_token, scopes })
    userDb = await userDb.save()
    return res.status(200).json()
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

module.exports = router
