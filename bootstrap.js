const wagner = require('wagner-core/lib')
const { Comment, User, Reply } = require('./models')
const validateComment = require('./models/validations/commentValidation')
const validateReply = require('./models/validations/replyValidation')
const validateUser = require('./models/validations/userValidation')

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
}
