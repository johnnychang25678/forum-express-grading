const express = require('express')
const router = express.Router()
const { authenticatedAdmin } = require('../middlewares/authentications')
// router modules
const admin = require('./modules/admin')
const home = require('./modules/home')


router.use('/admin', authenticatedAdmin, admin)
router.use('/', home)

module.exports = router
