const Joi = require('Joi')


const validateUser = async (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(255).required('firstName is required'),
    lastName: Joi.string().min(3).max(255).required('lastName is required'),
    email: Joi.string().email().required('email is required'),
    password: Joi.string().min(8).max(255).required('password is required'),
    city: Joi.string().min(2).max(255).required('city is required'),
    gender: Joi.string().required(),
    age: Joi.number().integer().required('is required'),
  })
  return schema.validate(user)
}



module.exports = validateUser
