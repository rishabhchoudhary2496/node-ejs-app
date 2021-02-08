const wagner = require('wagner-core')
const { Comment, User, Reply } = require('./models')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const multer = require('multer')
const validateComment = require('./models/validations/commentValidation')
const validateReply = require('./models/validations/replyValidation')
const validateUser = require('./models/validations/userValidation')
const {
  generateToken,
  verifyToken,
  decodeToken,
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require('./utils/generalUtils')

const UserController = require('./controllers/userController')
const ReplyController = require('./controllers/replyController')
const CommentController = require('./controllers/commentController')

const { isAuth, isUserVerified, isLoggedIn } = require('./utils/middlewares')
const storage = require('./utils/multerConfig')

const CLIENT_URL = 'http://localhost:5000'

module.exports = function () {
  wagner.factory('Comment', function () {
    return Comment
  })

  wagner.factory('User', function () {
    return User
  })

  wagner.factory('Reply', function () {
    return Reply
  })

  wagner.factory('validateComment', function () {
    return validateComment
  })

  wagner.factory('validateReply', function () {
    return validateReply
  })

  wagner.factory('validateUser', function () {
    return validateUser
  })

  wagner.factory('generateToken', function () {
    return generateToken
  })

  wagner.factory('verifyToken', function () {
    return verifyToken
  })

  wagner.factory('decodeToken', function () {
    return decodeToken
  })

  wagner.factory('sendVerificationEmail', function () {
    return sendVerificationEmail
  })

  wagner.factory('sendResetPasswordEmail', function () {
    return sendResetPasswordEmail
  })

  wagner.factory('CLIENT_URL', function () {
    return CLIENT_URL
  })

  wagner.factory('UserController', function () {
    return UserController
  })

  wagner.factory('ReplyController', function () {
    return ReplyController
  })

  wagner.factory('CommentController', function () {
    return CommentController
  })

  wagner.factory('isAuth', function () {
    return isAuth
  })

  wagner.factory('isUserVerified', function () {
    return isUserVerified
  })

  wagner.factory('isLoggedIn', function () {
    return isLoggedIn
  })

  wagner.factory('multer', function () {
    return multer
  })

  wagner.factory('passport', function () {
    return passport
  })

  wagner.factory('storage', function () {
    return storage
  })

  wagner.factory('LocalStrategy', function () {
    return LocalStrategy
  })

  wagner.factory('bcrypt', function () {
    return bcrypt
  })
}
