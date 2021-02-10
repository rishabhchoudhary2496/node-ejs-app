const wagner = require('wagner-core')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const multer = require('multer')
const { Comment, User, Reply } = require('./models')
const validateComment = require('./models/validations/commentValidation')
const validateReply = require('./models/validations/replyValidation')
const validateUser = require('./models/validations/userValidation')

const CLIENT_URL = 'http://localhost:5000'

module.exports = function () {
  wagner.factory('passport', function () {
    return passport
  })

  wagner.factory('LocalStrategy', function () {
    return LocalStrategy
  })

  wagner.factory('bcrypt', function () {
    return bcrypt
  })

  wagner.factory('multer', function () {
    return multer
  })

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

  wagner.factory('CLIENT_URL', function () {
    return CLIENT_URL
  })
}
