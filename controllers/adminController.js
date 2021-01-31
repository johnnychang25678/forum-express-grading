const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
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
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    return Restaurant.create({
      name, tel, address, opening_hours, description
    }).then(() => {
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    })
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
    return Restaurant.findByPk(req.params.id) // no need raw:true since we still need to use sequelize update
      .then(restaurant => {
        return restaurant.update({ // sequelize update
          name, tel, address, opening_hours, description
        })
      })
      .then(restaurant => {
        req.flash('success_messages', 'restaurant was successfully updated')
        return res.redirect('/admin/restaurants')
      })
  },
  deleteRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => restaurant.destroy())
      .then(() => res.redirect('/admin/restaurants'))
  }
}

module.exports = adminController