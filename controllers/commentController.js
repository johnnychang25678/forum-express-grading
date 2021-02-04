const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    const { text, restaurantId } = req.body
    return Comment.create({
      text,
      RestaurantId: restaurantId,
      UserId: req.user.id
    }).then(() => res.redirect(`/restaurants/${restaurantId}`))
  }
}

module.exports = commentController