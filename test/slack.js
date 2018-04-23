const axios = require('axios')

const requestsWebhookUrl = process.env.SLACK_WEBHOOKS_REQUESTS_URL
const newitemsWebhookUrl = process.env.SLACK_WEBHOOKS_NEWITEMS_URL


/**
 * Posts a request to the #requests channel
 * @param {String} user name of the user
 * @param {String} item
 * @param {String} link
 */
async function postRequest (user, item, link) {
  try {
    await axios.post(requestsWebhookUrl, {
      'text': `${user} requests <${link}|${item}>`
    })
    return true
  } catch (err) {
    return false
  }
}

/**
 * Posts a message to the #new-items channel
 * @param {String} owner      owner of the item
 * @param {String} title      item
 * @param {String} titleLink  link to the item
 * @param {String} [text]     item description
 * @param {String} [imageUrl] image link of the item
 */
async function postNewItem (owner, title, titleLink, text, imageUrl) {
  try {
    await axios.post(newitemsWebhookUrl, {
      'text': 'New item posted!',
      'attachments': [
        {
          'fallback': 'Required plain-text summary of the attachment.',
          'color': '#36a64f',
          'pretext': `${owner} listed ${title} on Community Credit`,
          'author_name': owner,
          'title': title,
          'title_link': titleLink,
          'text': text ? text : undefined,
          'image_url': imageUrl ? imageUrl : undefined
        }
      ]
    })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

/**
 * Sends a DM on slack from one user to another
 * @param {String} message message to send
 * @param {Object} from    User model
 * @param {Object} to      User model
 */
async function postDM (message, from, to) {
  // Both users should have a valid slack access token
  fromAccessToken = from.attributes.slack_access_token
  toAccessToken = to.attributes.slack_access_token
  if (!fromAccessToken || !toAccessToken) {
    return false
  }
  try {
    const response = await imOpen(fromAccessToken, to.attributes.slack_user_id)
    await postMessage(
      fromAccessToken,
      response.channel.id,
      message
    )
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

/**
 * Retrieves the user's identity on slack
 * @param {String} token access token of the user
 * @returns   https://api.slack.com/methods/users.identity
 */
async function getIdentity (token) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://slack.com/api/users.identity?${params}`
    })
    if (!response.data.ok) {
      throw new Error(`Slack error: ${response.data.error}`)
    }
    return response.data
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
}

/**
 * Opens a DM channel between two users
 * @param  {String} token Slack access token of user who's opening the channel
 * @param  {String} user  Slack userId of user who's recieving the channel open
 * @return {Object}       Slack im.open response data (https://api.slack.com/methods/im.open)
 */
async function imOpen(token, user) {
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
async function postMessage(token, channel, text) {
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
  postRequest, postNewItem, postDM
}