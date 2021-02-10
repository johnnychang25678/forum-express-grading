const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      include: [Category],
      raw: true,
      nest: true
    })
      .then(restaurants => {
        callback({ restaurants: restaurants }) // if json, will add another layer of {} 
      })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category],
      raw: true,
      nest: true
    })
      .then(restaurant => {
        callback({ restaurant })
      })
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
      })
      .then(() => {
        callback({ status: 'success', message: '' })
      })
  }
}

module.exports = adminService