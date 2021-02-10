const express = require('express')
const router = express.Router()
const { authenticatedAdmin, authenticatedUser } = require('../middlewares/authentications')
// router modules
const admin = require('./modules/admin')
const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const user = require('./modules/user')


router.use('/admin', authenticatedAdmin, admin)
router.use('/restaurants', authenticatedUser, restaurant)
router.use('/users', authenticatedUser, user) // for edit profile
router.use('/', home)

module.exports = router