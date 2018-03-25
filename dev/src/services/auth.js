import store from './store'
import qs from 'query-string'
const communitycreditToken = 'communitycreditToken'
const communitycreditUserId = 'communitycreditUserId'
const communitycreditUserName = 'communitycreditUserName'

// TODO: change based on dev environment
const server = ''

/**
 * Retrives token from local storage
 */
export function isAuthorized () {
  return localStorage.getItem('communitycreditToken')
}

export function getUserId () {
  return localStorage.getItem('communitycreditUserId')
}

export function getUserName () {
  return localStorage.getItem('communitycreditUserName')
}

/**
 * Attempts to login to the server with credentials. If successful, stores the jwt on local storage
 * @param {string} email - email of the user
 * @param {string} password - password
 * @returns {object} the response object from http request
 */
export function login (email, password) {
  return fetch(`${server}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email, password
    })
  }).then(res => res.json())
    .then(res => {
      if (res.success) {
        localStorage.setItem(communitycreditToken, res.token)
        localStorage.setItem(communitycreditUserId, res.user_id)
        localStorage.setItem(communitycreditUserName, res.name)
        store.commit('storeToken', res.token)
        store.commit('setId', res.user_id)
        store.commit('setName', res.name)
      }
      return res
    })
}

/**
 * Make an HTTP post request to create a new user
 * @param {string} firstname First name
 * @param {string} lastname Last name
 * @param {string} email Email
 * @param {string} password Password
 * @param {string} phone Phone
 * @returns {object} The response of the request
 */
export async function signup (firstname, lastname, email, phone, password) {
  try {
    let res = await fetch(`${server}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        phone,
        password
      })
    })
    return res.json()
  } catch (err) {
    console.log(err)
  }
}

/**
 * Removes jwt from local storage
 */
export function logout () {
  store.commit('storeToken', null)
  store.commit('setId', null)
  localStorage.removeItem(communitycreditToken)
  localStorage.removeItem(communitycreditUserId)
}

/**
 * Returns the slack Uri for connecting
 */
export function slackConnect () {
  const str = `https://slack.com/oauth/authorize?${qs.stringify({
    client_id: '274761581570.274905401125',
    scope: 'channels:write,groups:write,chat:write:bot,im:write,im:read',
    redirect_uri: 'http://127.0.0.1:8080/#/'
  })}`
  return str
}

/**
 * Retrieves access token from backend
 * @param {*} code Code used to retrieve an access token from slack
 */
export async function storeSlackAccessToken (code) {
  const response = await fetch(`${server}/api/addtoslack`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    body: JSON.stringify({ code })
  })
  if (response.ok) {
    console.log(response)
    const payload = await response.json()
    console.log(payload)
    store.commit('slack', payload)
    return payload
  }
}
