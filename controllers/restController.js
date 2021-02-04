const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment

const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId) // convert form str to number for sequelize where query
      whereQuery.CategoryId = categoryId // {CategoryId: 1}
    }

    const restaurantFindAll = Restaurant.findAndCountAll({ // returns count: # of rows, row:{data}
      include: [Category],
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })
    const categoryFindAll = Category.findAll({
      raw: true,
      nest: true
    })

    Promise.all([restaurantFindAll, categoryFindAll])
      .then(([restaurants, categories]) => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(restaurants.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((_, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        const data = restaurants.rows.map(restaurant => {
          return {
            ...restaurant.dataValues,
            description: restaurant.dataValues.description.substring(0, 50),
            categoryName: restaurant.Category.name
          }
        })
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          page,
          totalPage,
          prev,
          next
        })
      })

  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
  }
}

module.exports = restController