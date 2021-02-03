const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', { category: category.toJSON(), categories })
          })
      }
      return res.render('admin/categories', { categories })
    })
  },
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }
    return Category.create({ name })
      .then(() => {
        res.redirect('/admin/categories')
      })
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }
    return Category.findByPk(req.params.id)
      .then(category => {
        category.update({ name: req.body.name })
          .then(() => res.redirect('/admin/categories'))
      })
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => category.destroy())
      .then(() => res.redirect('/admin/categories'))
  }
}
module.exports = categoryController