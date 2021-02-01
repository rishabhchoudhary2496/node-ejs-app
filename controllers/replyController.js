const wagner = require('wagner-core')

const postReply = async (req, res) => {
  wagner.invoke(async (User, Comment, Reply, validateReply) => {
    const { userUUID, commentUUID, reply } = req.body

    const user = await User.findOne({
      where: {
        uuid: userUUID,
      },
    })

    if (!user)
      return res
        .status(404)
        .json({ message: "user with this id doesn't exist" })

    const comment = await Comment.findOne({
      where: {
        uuid: commentUUID,
      },
    })

    if (!comment)
      return res
        .status(404)
        .json({ message: "comment with this id doesn't exist" })

    const { error } = await validateReply({
      reply,
    })

    if (error) {
      // req.flash('errorMessage', error?.details[0].message)
      return res.status(400).json({ error: error?.details[0].message })
    }

    let userReply = await Reply.create({
      reply: reply,
      userId: user.id,
      commentId: comment.id,
    })

    if (userReply) {
      return res.status(200).json({ message: 'reply created' })
    } else {
      return res.status(500)
    }
  })
}

const getReplies = async (req, res) => {
  wagner.invoke(async (Reply, Comment, User) => {
    const replies = await Reply.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Comment, as: 'comment' },
      ],
    })

    return res.status(200).json({ replies: replies })
  })
}

module.exports = { postReply, getReplies }
