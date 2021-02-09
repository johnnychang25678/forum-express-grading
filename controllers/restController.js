const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment

const helpers = require('../_helpers')

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

        const favoritedRestaurants = helpers.getUser(req).FavoritedRestaurants
        const likedRestaurants = helpers.getUser(req).LikedRestaurants


        const data = restaurants.rows.map(restaurant => {
          return {
            ...restaurant.dataValues,
            description: restaurant.dataValues.description.substring(0, 50),
            categoryName: restaurant.Category.name,
            isFavorited: favoritedRestaurants ? favoritedRestaurants.map(favorite => favorite.id).includes(restaurant.id) : null,
            isLiked: likedRestaurants ? likedRestaurants.map(like => like.id).includes(restaurant.id) : null
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
        { model: User, as: 'FavoriteUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        const favoritedUsers = restaurant.FavoriteUsers
        const likedUsers = restaurant.LikedUsers
        return Restaurant.increment('viewCounts', {
          by: 1,
          where: { id: restaurant.id }
        }).then(() => {
          return res.render('restaurant', {
            restaurant: restaurant.toJSON(),
            isFavorited: favoritedUsers ? favoritedUsers.map(favorite => favorite.id).includes(helpers.getUser(req).id) : null,
            isLiked: likedUsers ? likedUsers.map(like => like.id).includes(helpers.getUser(req).id) : null
          })
        })
      })



  },
  getFeeds: (req, res) => {
    const restaurantFindAll = Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    })

    const commentFindAll = Comment.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User, Restaurant]
    })

    Promise.all([restaurantFindAll, commentFindAll])
      .then(([restaurants, comments]) => {
        return res.render('feeds', {
          restaurants,
          comments
        })
      })

  },
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment,
        { model: User, as: 'FavoriteUsers' }
      ]
    })
      .then(restaurant => {
        return res.render('dashboard', { restaurant: restaurant.toJSON() })
      })

  },
  getTopRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [
        {
          model: User,
          as: 'FavoriteUsers',
        }
      ],
    })
      .then(restaurants => {
        const favoritedRestaurants = helpers.getUser(req).FavoritedRestaurants
        const restaurantsData = restaurants.map(restaurant => {
          return {
            ...restaurant.dataValues,
            isFavorited: favoritedRestaurants ? favoritedRestaurants.map(favorite => favorite.id).includes(restaurant.id) : null,
            favoriteUserCount: restaurant.FavoriteUsers.length
          }
        }).sort((a, b) => b.favoriteUserCount - a.favoriteUserCount).slice(0, 10)
        return res.render('topRestaurants', { restaurants: restaurantsData })
      })
      .catch(err => console.log(err))
  }
}

module.exports = restController