const express = require('express')
const router = express.Router()
const restController = require('../../controllers/restController')

router.get('/', restController.getRestaurants)
router.get('/feeds', restController.getFeeds)
router.get('/:id', restController.getRestaurant)
router.get('/:id/dashboard', restController.getDashboard)

module.exports = router