const Joi = require('Joi')

const validateReply = async (reply) => {
  const schema = Joi.object({
    reply: Joi.string().max(60000).required('reply is required'),
  })
  return schema.validate(reply)
}

module.exports = validateReply
