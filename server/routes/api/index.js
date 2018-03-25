const __rootdir = global.__rootdir
const express = require('express')
const router = express.Router()

router.use(require('./users'))
router.use(require('./items'))
router.use(require('./requests'))
router.use(require('./notifications'))
router.use(require('./images'))
router.use(require('./slack'))

module.exports = router
