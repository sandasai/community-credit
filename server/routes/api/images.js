const __rootdir = global.__rootdir
const express = require('express')
const router = express.Router()
const Models = require(__rootdir + '/models')

router.use('/image/:id', async (req, res, next) => {
  const image = await Models.Image.find(req.params.id)

  if (image) {
    req.image = image
    return next()
  } else {
    return res.status(404).json({ message: 'No image found' })
  }
})

router.delete('/image/:id', async (req, res) => {
  try {
    await Models.Image.delete(req.image.id)
  } catch (err) {
    return res.status(500).json(err)
  }
  return res.status(200).json({})
})

module.exports = router
