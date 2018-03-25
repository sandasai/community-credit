const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('../services/jwt')
const User = require('../models/user')

router.post('/signup', async (req, res) => {
  const { email, password, phone, firstname, lastname } = req.body
  let hash, user
  try {
    hash = await bcrypt.hashSync(password, 10)
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: err
    })
  }
  user = new User({
    first_name: firstname,
    last_name: lastname,
    password: hash,
    phone,
    email
  })
  try {
    await user.save()
    return res.status(201).json({
      success: true
    })
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: err
    })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email and/or password is invalid'
      })
    }
    const result = await bcrypt.compare(password, user.password)
    if (result) {
      console.log(user.first_name)
      return res.status(202).json({
        success: true,
        token: jwt.signToken(user.id, user.email),
        user_id: user.id,
        name: user.first_name
      })
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email and/or password is invalid'
      })
    }
  } catch (err) {
    return res.status(504)
  }
})

module.exports = router
