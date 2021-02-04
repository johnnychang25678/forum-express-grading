const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId) // convert form str to number for sequelize where query
      whereQuery.CategoryId = categoryId // {CategoryId: 1}
    }

    const restaurantFindAll = Restaurant.findAll({
      include: [Category],
      where: whereQuery
    })
    const categoryFindAll = Category.findAll({
      raw: true,
      nest: true
    })

    Promise.all([restaurantFindAll, categoryFindAll])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(restaurant => {
          return {
            ...restaurant.dataValues,
            description: restaurant.dataValues.description.substring(0, 50),
            categoryName: restaurant.Category.name
          }
        })
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId
        })
      })

  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
  }
}

module.exports = restController