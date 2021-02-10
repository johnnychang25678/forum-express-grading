const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    const findRestaurant = Restaurant.findByPk(req.params.id)
    const findComments = Comment.findAll({
      where: { RestaurantId: req.params.id }
    })

    Promise.all([findRestaurant, findComments])
      .then(([restaurant, comments]) => {
        const destroyRestaurant = restaurant.destroy()
        const destroyComments = comments.map(comment => comment.destroy())
        return Promise.all([destroyRestaurant, destroyComments])
      })
      .then(() => callback({ status: 'success', message: '' }))
      .catch(err => console.log(err))
  },
  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      callback({ status: 'error', message: "name didn't exist" })
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
              callback({ status: 'success', message: 'restaurant was successfully created' })
            })
        })
        .catch(err => {
          callback({ status: 'error', message: err })
        })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description,
        image: null,
        CategoryId: categoryId
      })
        .then(() => {
          callback({ status: 'success', message: 'restaurant was successfully created' })
        })
    }

  },
  putRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      callback({ status: 'error', message: "name didn't exist" })
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
              callback({ status: 'success', message: 'restaurant was successfully updated' })
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
          callback({ status: 'success', message: 'restaurant was successfully updated' })
        })
    }
  }
}

module.exports = adminService