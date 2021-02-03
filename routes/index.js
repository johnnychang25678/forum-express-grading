const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')
// router modules
const admin = require('./modules/admin')
const home = require('./modules/home')

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

router.use('/admin', authenticatedAdmin, admin)
router.use('/', home)

module.exports = router
