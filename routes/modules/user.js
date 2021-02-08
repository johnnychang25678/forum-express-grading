const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// users
router.get('/top', userController.getTopUser)
router.get('/:id', userController.getUser)
router.get('/:id/edit', userController.editUser)
router.put('/:id', upload.single('image'), userController.putUser)


module.exports = router