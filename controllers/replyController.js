class ReplyController {
  static User
  static Comment
  static Reply
  static validateReply

  static setData(User, Comment, Reply, validateReply) {
    this.User = User
    this.Comment = Comment
    this.Reply = Reply
    this.validateReply = validateReply
  }

  static postReply = async (req, res) => {
    const { userUUID, commentUUID, reply } = req.body

    const user = await this.User.findOne({
      where: {
        uuid: userUUID,
      },
    })

    if (!user)
      return res
        .status(404)
        .json({ message: "user with this id doesn't exist" })

    const comment = await this.Comment.findOne({
      where: {
        uuid: commentUUID,
      },
    })

    if (!comment)
      return res
        .status(404)
        .json({ message: "comment with this id doesn't exist" })

    const { error } = await this.validateReply({
      reply,
    })

    if (error) {
      return res.status(400).json({ error: error?.details[0].message })
    }

    let userReply = await this.Reply.create({
      reply: reply,
      userId: user.id,
      commentId: comment.id,
    })

    if (userReply) {
      return res.status(200).json({ message: 'reply created' })
    } else {
      return res.status(500)
    }
  }

  static getReplies = async (req, res) => {
    const replies = await this.Reply.findAll({
      include: [
        { model: this.User, as: 'user' },
        { model: this.Comment, as: 'comment' },
      ],
    })

    return res.status(200).json({ replies: replies })
  }
}

module.exports = ReplyController
