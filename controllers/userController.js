const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')

let userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      req.flash('error_messages', '兩次輸入密碼不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({
        where: { email }
      }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          })
            .then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/signin')
            })
        }
      })
    }

  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_message', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: { model: Comment, include: [Restaurant] }
    })
      .then(user => {
        if (!user) {
          req.flash('error_messages', "The user doesn't exist!")
          return res.redirect('/restaurants') // route to home page if no user
        }
        const profile = user.toJSON()
        const commentedRestaurants = profile.Comments.map(comment => comment.Restaurant)

        return res.render('profile', {
          profile,
          commentedRestaurants
        })
      })

  },
  editUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) { // user can only edit their own profile
      req.flash('error_messages', "You can only edit your own profile!")
      return res.redirect(`/users/${helpers.getUser(req).id}`)
    }
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          req.flash('error_messages', "The user doesn't exist!")
          return res.redirect('/restaurants') // route to home page if no user
        }
        return res.render('editProfile', { profile: user.toJSON() })
      })

  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    if (req.file) { // if user uploads profile image
      imgur.setClientId(IMGUR_CLIENT_ID)
      imgur.uploadFile(req.file.path)
        .then(img => {
          return User.findByPk(req.params.id)
            .then(user => {
              return user.update({
                name: req.body.name,
                image: img.data.link
              })
            })
            .then(user => {
              req.flash('success_messages', 'User profile was successfully updated')
              return res.redirect(`/users/${user.id}`)
            })
        })
    } else { // if user doesn't upload image
      return User.findByPk(req.params.id)
        .then(user => {
          return user.update({
            name: req.body.name,
            image: user.image
          })
        })
        .then(user => {
          req.flash('success_messages', 'User profile was successfully updated')
          return res.redirect(`/users/${user.id}`)
        })
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id, // from passport
      RestaurantId: req.params.restaurantId
    })
      .then(() => res.redirect('back'))
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(favorite => favorite.destroy())
      .then(() => res.redirect('back'))
  },
  like: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => res.redirect('back'))
  },
  unlike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(like => like.destroy())
      .then(() => res.redirect('back'))
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        const userData = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length, // how many followers do the users have
          // check if the logged in user is following this user
          isFollowed: helpers.getUser(req).Followings.map(following => following.id).includes(user.id)
        })).sort((a, b) => b.FollowerCount - a.FollowerCount)
        return res.render('topUser', { users: userData })
      })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then(() => res.redirect('back'))
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => followship.destroy())
      .then(() => res.redirect('back'))
  }
}

module.exports = userController