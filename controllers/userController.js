const { User } = require('../models')
const validateUser = require('../models/validations/userValidation')
const {
  generateToken,
  verifyToken,
  sendVerificationEmail,
  decodeToken,
  sendResetPasswordEmail,
} = require('../utils/generalUtils')

const CLIENT_URL = 'http://localhost:5000'

module.exports.createUser = async (req, res) => {
  let { firstName, lastName, email, password, country,state,city, gender, age } = req.body
  const { error } = await validateUser({
    firstName,
    lastName,
    email,
    password,
    country,
    state,
    city,
    gender,
    age,
  })

  if (error) {
    req.flash('errorMessage', error?.details[0].message)
    return res.status(400).json({ error: error?.details[0].message })
  }

  let user = await User.findOne({
    where: {
      email: email,
    },
  })

  if (user) {
    req.flash('errorMessage', 'User with this email already exist')
    return res.status(400).json({ error: 'User with this email already exist' })
  }

  password = await User.hashPassword(password)

  user = await User.create({
    firstName,
    lastName,
    email,
    password,
    country,
    state,
    city,
    gender,
    age,
  })

  console.log('usr', user)

  const token = await generateToken({ uuid: user.uuid })
  console.log('token', token)
  sendVerificationEmail(CLIENT_URL, token, user)

  console.log(user)

  res.status(200).json('signed up.Verification Email Sent')
}

//=============================================================
//verify user

module.exports.verifyUser = async (req, res) => {
  const { token } = req.body
  console.log('token', token)
  let decoded

  //trying to verify even token is not expired and decode it
  try {
    decoded = await verifyToken(token)
    console.log('d', decoded)
  } catch (err) {
    if (err.name == 'TokenExpiredError') {
      decoded = await decodeToken(req.body.token)
      let user = await User.findOne({
        where: {
          uuid: decoded.uuid,
        },
      })
      if (!user) {
        return res.status(400).json({ message: 'invalid token' })
      }

      const token = await generateToken({ uuid: user.uuid })
      sendVerificationEmail(CLIENT_URL, token, user)
      return res
        .status(400)
        .json({ message: 'Verification Link Expired.Sending New Link' })
    }
  }

  let user = await User.findOne({
    where: {
      uuid: decoded.uuid,
    },
  })

  if (!user) return res.status(400).json({ message: 'invalid id' })

  if (user) {
    user.isVerified = true
  }
  await user.save()
  req.flash('message', 'verification complete')
  return res.status(200).json({ message: 'verification complete' })
}

//=======================================================================

//forgot Password
module.exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    req.flash('message', 'email id required')
    return res.status(400).json({ error: 'email id required' })
  }

  let user = await User.findOne({
    where: {
      email: email,
    },
  })

  if (!user) {
    req.flash('message', "couldn't find your account")
    return res.status(400).json({ error: "couldn't find your account" })
  }

  const token = await generateToken({ uuid: user.uuid })
  sendResetPasswordEmail(CLIENT_URL, token, user)
  res.status(200).json({ message: 'reset password link sent' })
}

//================================================================
//reset password

module.exports.handleResetPassword = async (req, res) => {
  let { password, token } = req.body
  console.log('password', password)
  console.log('token', token)
  let decoded

  //trying to verify even token is not expired and decode it
  try {
    decoded = await verifyToken(token)
    console.log('d', decoded)
  } catch (err) {
    if (err.name == 'TokenExpiredError') {
      decoded = await decodeToken(req.body.token)
      let user = await User.findOne({
        where: {
          uuid: decoded.uuid,
        },
      })
      if (!user) {
        return res.status(400).json({ message: 'invalid token' })
      }

      const token = await generateToken({ uuid: user.uuid })
      sendResetPasswordEmail(CLIENT_URL, token, user)
      return res
        .status(400)
        .json({ message: 'Reset Password Link Expired.Sending New Link' })
    }
  }

  let user = await User.findOne({
    where: {
      uuid: decoded.uuid,
    },
  })

  if (!user) return res.status(400).json({ message: 'invalid id' })
  password = await User.hashPassword(password)
  user.password = password
  await user.save()
  return res.status(200).json({ message: 'password reset successfull' })
}

//==========================
//get users data

module.exports.getUsersData = async function(req,res) {
  const users = await User.findAll();
  res.render('home', {
    title: 'home',
    users: users,
    layout: './layouts/FullWidthLayoutLight',
  })
}


//=============================
module.exports.resendVerificationEmail = async(req,res) => {
  const user = req.user.dataValues;
  if(!user) return res.status(400).json({message:"couldn't find your account"});
  const token = await generateToken({ uuid: user.uuid })
  sendVerificationEmail(CLIENT_URL, token, user)
  res.status(200).send('Verification email sent')
}