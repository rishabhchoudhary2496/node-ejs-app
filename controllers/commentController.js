class CommentController {
  static Comment
  static User
  static validateComment

  static setData(Comment, User, validateComment) {
    this.Comment = Comment
    this.User = User
    this.validateComment = validateComment
  }

  static postComment = async (req, res) => {
    const { uuid, comment } = req.body

    const user = await this.User.findOne({
      where: {
        uuid: uuid,
      },
    })

    if (!user)
      return res
        .status(404)
        .json({ message: "user with this id doesn't exist" })

    const { error } = await this.validateComment({
      comment,
    })

    if (error) {
      return res.status(400).json({ error: error?.details[0].message })
    }

    let userComment = await this.Comment.create({
      comment: comment,
      userId: user.id,
    })
    if (userComment) {
      return res.status(200).json({ message: 'comment created' })
    } else {
      return res.status(500)
    }
  }

  static getComment = async (req, res) => {
    console.log('this.comment', this)
    let comments = await this.Comment.findAll({
      include: [{ model: this.User, as: 'user' }],
    })

    return res.status(200).json({ comments: comments })
  }
}

module.exports = CommentController
