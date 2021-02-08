const wagner = require('wagner-core/lib')
const { Comment, User, Reply } = require('./models')
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
}
