const express = require('express')
const router = express.Router()
const wagner = require('wagner-core')

wagner.invoke(
  (
    ReplyController,
    User,
    Comment,
    Reply,
    validateReply,
    isAuth,
    isUserVerified
  ) => {
    ReplyController.setData(User, Comment, Reply, validateReply)
    router.post('/', isAuth, isUserVerified, ReplyController.postReply)
    router.get('/', isAuth, isUserVerified, ReplyController.getReplies)
  }
)

module.exports = router
