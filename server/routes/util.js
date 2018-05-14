/**
 * Given a request object, returns the absolute base url of this running application
 * @param {Object} req Express request object
 */
function getAbsBaseUrl(req) {
  return req.protocol + '://' + req.get('host') + '/'
}

module.exports = {
  getAbsBaseUrl
}