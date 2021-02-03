const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/adminController')
const categoryController = require('../../controllers/categoryController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/', (req, res) => res.redirect('/admin/restaurants'))
router.get('/users', adminController.getUsers)
router.put('/users/:id/toggleAdmin', adminController.toggleAdmin)

router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/categories', categoryController.getCategories)

module.exports = router