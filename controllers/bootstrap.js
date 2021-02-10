const wagner = require('wagner-core')
const UserController = require('./userController')
const ReplyController = require('./replyController')
const CommentController = require('./commentController')

module.exports = function () {
  wagner.factory('UserController', function () {
    return UserController
  })

  wagner.factory('ReplyController', function () {
    return ReplyController
  })

  wagner.factory('CommentController', function () {
    return CommentController
  })
}
