const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User

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
  getRestaurants: (req, res) => {
    Restaurant.findAll({
      raw: true
    }).then(restaurants => res.render('admin/restaurants', { restaurants }))
  },
  // show single restaurant
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
  },
  // create form
  createRestaurants: (req, res) => {
    return res.render('admin/create')
  },
  // create new restaurant
  postRestaurant: (req, res) => {
    console.log('------------req.file: ', req.file)
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req // multer attach file to req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        console.log('-------uploading image---------')
        if (err) console.log('Error: ', err)
        // write data into upload folder then save to database
        return Restaurant.create({
          name, tel, address, opening_hours, description,
          image: file ? img.data.link : null
        })
          .then(() => {
            req.flash('success_messages', 'restaurant was successfully created')
            res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description,
        image: null
      })
        .then(() => {
          req.flash('success_messages', 'restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
    }

  },
  // edit form
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        return res.render('admin/create', { restaurant })
      })
  },
  // update restaurant info
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        console.log('-------uploading image---------')
        if (err) console.log('Error: ', err)
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            return restaurant.update({ // sequelize update
              name, tel, address, opening_hours, description,
              image: file ? img.data.link : restaurant.image
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
            name, tel, address, opening_hours, description, image: restaurant.image
          })
        })
        .then(() => {
          req.flash('success_messages', 'restaurant was successfully updated')
          return res.redirect('/admin/restaurants')
        })
    }
  },
  deleteRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => restaurant.destroy())
      .then(() => res.redirect('/admin/restaurants'))
  }
}

module.exports = adminController