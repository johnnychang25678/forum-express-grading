const express = require('express')
const router = express.Router()
const { authenticatedUser, authenticatedAdmin } = require('../../middlewares/authentications')
const passport = require('../../config/passport')

// controllers
const userController = require('../../controllers/userController')
const commentController = require('../../controllers/commentController')


const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// home page
router.get('/', (req, res) => {
  return res.redirect('/restaurants')
})

// signup
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// login
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
// logout
router.get('/logout', userController.logout)

// comments
router.post('/comments', authenticatedUser, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// users
router.get('/users/:id', authenticatedUser, userController.getUser)
router.get('/users/:id/edit', authenticatedUser, userController.editUser)
router.put('/users/:id', authenticatedUser, upload.single('image'), userController.putUser)

// favorites
router.post('/favorite/:restaurantId', authenticatedUser, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticatedUser, userController.removeFavorite)

// likes
router.post('/like/:restaurantId', authenticatedUser, userController.like)
router.delete('/like/:restaurantId', authenticatedUser, userController.unlike)

module.exports = router