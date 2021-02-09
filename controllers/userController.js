class UserController {
  static User
  static validateUser
  static generateToken
  static verifyToken
  static sendVerificationEmail
  static decodeToken
  static sendResetPasswordEmail
  static CLIENT_URL

  static setData(
    User,
    validateUser,
    generateToken,
    verifyToken,
    sendVerificationEmail,
    decodeToken,
    sendResetPasswordEmail,
    CLIENT_URL
  ) {
    this.User = User
    this.validateUser = validateUser
    this.generateToken = generateToken
    this.verifyToken = verifyToken
    this.sendVerificationEmail = sendVerificationEmail
    this.decodeToken = decodeToken
    this.sendResetPasswordEmail = sendResetPasswordEmail
    this.CLIENT_URL = CLIENT_URL
  }

  static createUser = async (req, res) => {
    let {
      firstName,
      lastName,
      email,
      password,
      country,
      state,
      city,
      gender,
      age,
    } = req.body
    const { error } = await this.validateUser({
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

    let user = await this.User.findOne({
      where: {
        email: email,
      },
    })

    if (user) {
      req.flash('errorMessage', 'User with this email already exist')
      return res
        .status(400)
        .json({ error: 'User with this email already exist' })
    }

    password = await this.User.hashPassword(password)

    user = await this.User.create({
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

    const token = await this.generateToken({ uuid: user.uuid })
    console.log('token', token)
    this.sendVerificationEmail(this.CLIENT_URL, token, user)

    console.log(user)

    res.status(200).json('signed up.Verification Email Sent')
  }

  static verifyUser = async (req, res) => {
    const { token } = req.body
    console.log('token', token)
    let decoded

    //trying to verify even token is not expired and decode it
    try {
      decoded = await this.verifyToken(token)
      console.log('d', decoded)
    } catch (err) {
      if (err.name == 'TokenExpiredError') {
        decoded = await this.decodeToken(req.body.token)
        let user = await this.User.findOne({
          where: {
            uuid: decoded.uuid,
          },
        })
        if (!user) {
          return res.status(400).json({ message: 'invalid token' })
        }

        const token = await this.generateToken({ uuid: user.uuid })
        this.sendVerificationEmail(this.CLIENT_URL, token, user)
        return res
          .status(400)
          .json({ message: 'Verification Link Expired.Sending New Link' })
      }
    }

    let user = await this.User.findOne({
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

  static handleForgotPassword = async (req, res) => {
    const { email } = req.body

    if (!email) {
      req.flash('message', 'email id required')
      return res.status(400).json({ error: 'email id required' })
    }

    let user = await this.User.findOne({
      where: {
        email: email,
      },
    })

    if (!user) {
      req.flash('message', "couldn't find your account")
      return res.status(400).json({ error: "couldn't find your account" })
    }

    const token = await this.generateToken({ uuid: user.uuid })
    this.sendResetPasswordEmail(this.CLIENT_URL, token, user)
    res.status(200).json({ message: 'reset password link sent' })
  }

  static handleResetPassword = async (req, res) => {
    let { password, token } = req.body
    console.log('password', password)
    console.log('token', token)
    let decoded

    //trying to verify even token is not expired and decode it
    try {
      decoded = await this.verifyToken(token)
      console.log('d', decoded)
    } catch (err) {
      if (err.name == 'TokenExpiredError') {
        decoded = await this.decodeToken(req.body.token)
        let user = await this.User.findOne({
          where: {
            uuid: decoded.uuid,
          },
        })
        if (!user) {
          return res.status(400).json({ message: 'invalid token' })
        }

        const token = await this.generateToken({ uuid: user.uuid })
        this.sendResetPasswordEmail(this.CLIENT_URL, token, user)
        return res
          .status(400)
          .json({ message: 'Reset Password Link Expired.Sending New Link' })
      }
    }

    let user = await this.User.findOne({
      where: {
        uuid: decoded.uuid,
      },
    })

    if (!user) return res.status(400).json({ message: 'invalid id' })
    password = await this.User.hashPassword(password)
    user.password = password
    await user.save()
    return res.status(200).json({ message: 'password reset successfull' })
  }

  static getUsersData = async (req, res) => {
    const users = await this.User.findAll()
    res.render('home', {
      title: 'home',
      users: users,
      layout: './layouts/FullWidthLayoutLight',
    })
  }

  static resendVerificationEmail = async (req, res) => {
    const user = req.user.dataValues
    if (!user)
      return res.status(400).json({ message: "couldn't find your account" })
    const token = await this.generateToken({ uuid: user.uuid })
    this.sendVerificationEmail(this.CLIENT_URL, token, user)
    res.status(200).send('Verification email sent')
  }

  static getProfileData = async (req, res) => {
    const email = req.user.dataValues.email
    let user = await this.User.findOne({
      where: {
        email: email,
      },
    })

    res.render('Profile', {
      title: 'profile',
      user: user,
      layout: './layouts/FullWidthLayoutLight',
    })
  }

  static uploadProfilePic = async (req, res) => {
    const email = req.user.dataValues.email
    let user = await this.User.findOne({
      where: {
        email: email,
      },
    })

    user.profilePic = req.file.path
    user.save()
    res.redirect('/profile')
  }
}

module.exports = UserController
