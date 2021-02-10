const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', { category: category.toJSON(), categories })
          })
      } else {
        return callback({ categories })
      }
    })
  },
  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }
    return Category.create({ name })
      .then(() => {
        return callback({ status: 'success', message: 'category was successfully created' })
      })
  },
  putCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }
    return Category.findByPk(req.params.id)
      .then(category => {
        return category.update({ name })
      })
      .then(() => {
        return callback({ status: 'success', message: 'category was successfully updated' })
      })
  }
}

module.exports = categoryService