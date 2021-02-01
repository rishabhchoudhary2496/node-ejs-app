const Joi = require('Joi')

const validateComment = async (comment) => {
  const schema = Joi.object({
    comment: Joi.string().max(60000).required('comment is required'),
  })
  return schema.validate(comment)
}

module.exports = validateComment
