const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// users
router.get('/top', userController.getTopUser) // top users page
router.get('/:id', userController.getUser) // single user page
router.get('/:id/edit', userController.editUser) // edit user page
router.put('/:id', upload.single('image'), userController.putUser)


module.exports = router