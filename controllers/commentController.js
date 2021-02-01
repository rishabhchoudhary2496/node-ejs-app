// const { Comment, User } = require('../models')
const wagner = require('wagner-core')

const postComment = async (req, res) => {
  wagner.invoke(async (User, Comment, validateComment) => {
    const { uuid, comment } = req.body

    const user = await User.findOne({
      where: {
        uuid: uuid,
      },
    })

    if (!user)
      return res
        .status(404)
        .json({ message: "user with this id doesn't exist" })

    const { error } = await validateComment({
      comment,
    })

    if (error) {
      // req.flash('errorMessage', error?.details[0].message)
      return res.status(400).json({ error: error?.details[0].message })
    }

    let userComment = await Comment.create({
      comment: comment,
      userId: user.id,
    })
    if (userComment) {
      return res.status(200).json({ message: 'comment created' })
    } else {
      return res.status(500)
    }
  })
}

const getComments = async (req, res) => {
  wagner.invoke(async (Comment) => {
    wagner.invoke(async (User) => {
      let comments = await Comment.findAll({
        include: [{ model: User, as: 'user' }],
      })

      return res.status(200).json({ comments: comments })
    })
  })
}

module.exports = {
  postComment,
  getComments,
}
