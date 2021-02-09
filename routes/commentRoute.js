const express = require('express')
const router = express.Router()
const wagner = require('wagner-core')

wagner.invoke(
  (
    CommentController,
    Comment,
    User,
    validateComment,
    isAuth,
    isUserVerified
  ) => {
    CommentController.setData(Comment, User, validateComment)
    router.post('/', isAuth, isUserVerified, CommentController.postComment)
    router.get('/', isAuth, isUserVerified, CommentController.getComment)
  }
)

module.exports = router
