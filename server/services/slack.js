const slack = require('../config').slack
const axios = require('axios')

/**
 * Retrieves the access token of a user
 * @param  {String} code Code send from client
 * @return {Object}      Response object from Slack's oauth api (https://api.slack.com/docs/oauth#flow)
 */
async function getAccessToken (code) {
  const { clientSecret, clientId } = slack
  try {
    const response = await axios.get(`https://slack.com/api/oauth.access?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`)
    return response.data
  } catch (err) {
    throw err
  }
}

/**
 * Creates a new private channel between two users (if they have added to slack)
 * @param  {String} item       Item name that was posted
 * @param  {Object} owner      User owner who posted the item
 * @param  {Object} requester  User requester who requested the item
 * @return {Boolean}           True if message was successfully send
 */
async function sendItemListMsg (item, owner, requester) {
  const ownerSlack = JSON.parse(owner.slack_metadata)
  const requesterSlack = JSON.parse(requester.slack_metadata)
  // Both users should have a slack account
  if (!ownerSlack || !requesterSlack) {
    return false
  }
  try {
    const response = await slackImOpen(ownerSlack.access_token, requesterSlack.user_id)
    await slackChatPostMessage(
      ownerSlack.access_token,
      response.channel.id,
      `${owner.first_name} posted a ${item} for your request on the store!`)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

/**
 * Opens a DM channel between two users
 * @param  {String} token Slack access token of user who's opening the channel
 * @param  {String} user  Slack userId of user who's recieving the channel open
 * @return {Object}       Slack im.open response data (https://api.slack.com/methods/im.open)
 */
async function slackImOpen (token, user) {
  const response = await axios({
    url: 'https://slack.com/api/im.open',
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: {
      user,
      return_im: true
    }
  })
  if (!response.data.ok) {
    throw new Error(response.data.error)
  } else {
    return response.data
  }
}

/**
 * Posts a message as a bot through a user's token
 * @param  {String} token   Slack access token of user
 * @param  {String} channel Slack Channel id that user posts to
 * @param  {String} text    Content that user posts to channel
 * @return {Object}         Slack chat.postMessage response data (https://api.slack.com/methods/chat.postMessage)
 */
async function slackChatPostMessage (token, channel, text) {
  const response = await axios({
    url: 'https://slack.com/api/chat.postMessage',
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: {
      channel,
      text,
      as_user: false
    }
  })
  if (!response.data.ok) {
    throw new Error(response.data.error)
  } else {
    return response.data
  }
}

module.exports = {
  getAccessToken,
  sendItemListMsg
}
