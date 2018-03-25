const cloudinary = require('cloudinary')
const configParams = require('../config').cloudinary

if (process.env.NODE_ENV === 'developement') {
  const { cloud_name, api_key, api_secret } = configParams

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret
  })
}

/**
 * Returns a promise that resolves data like this if successful:
 *  {
 *    public_id: 'sample',
 *    version: 1312461204,
 *    width: 864,
 *    height: 576,
 *    format: 'jpg',
 *    bytes: 120253,
 *    url: 'https://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg',
 *    secure_url: 'https://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg'
 *  }
 * @param {File} file - The image file to upload
 * @returns
 */
function uploadImageFile (file) {
  return new Promise((resolve, reject) => {
    if (file.type.substr(0, file.type.indexOf('/')) !== 'image') {
      reject(new Error(`Recieved file type ${file.type}. Only 'image' file types are accepted`))
    }
    cloudinary.uploader.upload(file.path, (result) => {
      resolve(result)
    })
  })
}

module.exports = {
  uploadImageFile
}
