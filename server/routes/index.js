const express = require('express')
const router = express.Router()
const authRoutes = require('./auth')
const apiRoutes = require('./api')
const bearerToken = require('express-bearer-token')
const jwt = require('../services/jwt')
const Models = require('../models')

router.use('/auth', authRoutes)

/*
// Authentication middleware
router.use('/api', bearerToken())
router.use('/api', async (req, res, next) => {
  const { token } = req
  try {
    const decoded = await jwt.verifyToken(token)
    req.user = await Models.User.find(decoded.id)
    next()
  } catch (err) {
    return res.status(400).json({
      message: 'You must have a valid login'
    })
  }
})

*/
router.use('/api', apiRoutes)

module.exports = router
