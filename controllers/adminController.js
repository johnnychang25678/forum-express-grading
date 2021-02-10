const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const adminService = require('../services/adminService')

const adminController = {
  // show all users
  getUsers: (req, res) => {
    User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))
  },
  toggleAdmin: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => user.update({ isAdmin: !user.isAdmin }))
      .then(() => {
        req.flash('success_messages', 'user was successfully updated')
        return res.redirect('/admin/users')
      })
  },
  // show all restaurants
  getRestaurants: (req, res, data) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  // show single restaurant
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  // create form
  createRestaurants: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', { categories })
    })

  },
  // create new restaurant
  postRestaurant: (req, res) => {
    console.log('------------req.file: ', req.file)
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req // multer attach file to req.file
    if (file) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      imgur.uploadFile(req.file.path)
        .then(img => {
          return Restaurant.create({
            name, tel, address, opening_hours, description,
            image: file ? img.data.link : null,
            CategoryId: categoryId
          })
            .then(() => {
              req.flash('success_messages', 'restaurant was successfully created')
              res.redirect('/admin/restaurants')
            })
        })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description,
        image: null,
        CategoryId: categoryId
      })
        .then(() => {
          req.flash('success_messages', 'restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
    }

  },
  // edit form
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id, { raw: true })
        .then(restaurant => {
          return res.render('admin/create', { categories, restaurant })
        })
    })

  },
  // update restaurant info
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      imgur.uploadFile(req.file.path)
        .then(img => {
          return Restaurant.findByPk(req.params.id)
            .then(restaurant => {
              return restaurant.update({ // sequelize update
                name, tel, address, opening_hours, description,
                image: file ? img.data.link : restaurant.image,
                CategoryId: categoryId
              })
            })
            .then(() => {
              req.flash('success_messages', 'restaurant was successfully updated')
              return res.redirect('/admin/restaurants')
            })
        })
    } else {
      return Restaurant.findByPk(req.params.id) // no need raw:true since we still need to use sequelize update
        .then(restaurant => {
          return restaurant.update({ // sequelize update
            name, tel, address, opening_hours, description,
            image: restaurant.image,
            CategoryId: categoryId
          })
        })
        .then(() => {
          req.flash('success_messages', 'restaurant was successfully updated')
          return res.redirect('/admin/restaurants')
        })
    }
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
}

module.exports = adminController