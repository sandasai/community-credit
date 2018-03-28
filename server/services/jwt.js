const jwt = require('jsonwebtoken')
const jwtsecret = require('../../config.json').jwt.secret

/**
 * Signs a JSON web token using an email
 * @param {number} id
 * @param {string} email - email to encode on the token
 */
function signToken (id, email) {
  return jwt.sign({ id, email }, jwtsecret)
}

function sign (id, authType) {
  return jwt.sign({ id, authType }, jwtsecret)
}

/**
 * Verifies a JSON web token
 * @param {string} token - token to decode
 */
function verifyToken (token) {
  return jwt.verify(token, jwtsecret)
}

module.exports = {
  signToken,
  verifyToken,
  sign
}
