const cloudinary = require('cloudinary')
const configParams = require('../config').cloudinary

// Cloudinary API uses env variable CLOUDINARY_URL for connection string

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
function uploadImageFile(file) {
  return new Promise((resolve, reject) => {
    if (file.type.substr(0, file.type.indexOf('/')) !== 'image') {
      reject(new Error(`Recieved file type ${file.type}. Only 'image' file types are accepted`))
    }
    cloudinary.v2.uploader.upload(file.path, function (err, result) {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

function deleteImage(publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, function (err, result) {
      if (err) {
        reject(err)
      }
      resolve(result)
    });
  })
}

module.exports = {
  uploadImageFile, deleteImage
}
