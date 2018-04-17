const axios = require('axios')
const config = require('../config')

const requestsWebhookUrl = config.slack.webhooks['requests']
const newitemsWebhookUrl = config.slack.webhooks['new-items']


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
  console.log('slack posting item')
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

module.exports = {
  postRequest, postNewItem
}