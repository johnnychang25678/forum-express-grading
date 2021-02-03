const express = require('express')
const router = express.Router()
const helpers = require('../../_helpers')
const passport = require('../../config/passport')

// controllers
const userController = require('../../controllers/userController')
const restController = require('../../controllers/restController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  return res.redirect('/signin')
}

router.get('/', (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
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

module.exports = router