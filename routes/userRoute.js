const express = require('express')
const router = express.Router()
const wagner = require('wagner-core')

wagner.invoke(
  (
    User,
    validateUser,
    generateToken,
    verifyToken,
    sendVerificationEmail,
    decodeToken,
    sendResetPasswordEmail,
    CLIENT_URL,
    UserController,
    isLoggedIn,
    isAuth,
    isUserVerified,
    multer,
    storage,
    passport
  ) => {
    UserController.setData(
      User,
      validateUser,
      generateToken,
      verifyToken,
      sendVerificationEmail,
      decodeToken,
      sendResetPasswordEmail,
      CLIENT_URL
    )

    router.get('/signUp', (req, res) => {
      res.render('SignUp', {
        title: 'SignUp',
        expressFlash: req.flash('errorMessage'),
        layout: './layouts/SignUpLayout',
      })
    })

    router.post('/signUp', isLoggedIn, UserController.createUser)

    //=============login===============

    router.get('/login', isLoggedIn, (req, res) => {
      res.render('Login', { title: 'login', message: req.flash('message') })
    })

    router.post('/login', (req, res, next) => {
      passport.authenticate(
        'local',
        { failureFlash: true },
        function (error, user, info) {
          if (error) {
            return res.status(500).json(error)
          }
          if (!user) {
            return res.status(400).json(info.message)
          } else {
            req.login(user, function (err) {
              if (err) {
                return res.status(500).json(err)
              }
            })
          }
          res.json(user)
        }
      )(req, res, next)
    })

    //=============logout===============

    router.get('/logout', (req, res) => {
      console.log(req.url)
      req.logout()
      res.redirect('/login')
    })

    //=========verifyAccount=============

    router.get('/verifyAccount', (req, res) => {
      res.render('verifyAccount', {
        title: 'verifyAccount',
        expressFlash: req.flash('message'),
      })
    })

    router.post('/verifyAccount', UserController.verifyUser)

    //========forgotPassword=============

    router.post('/forgotPassword', UserController.handleForgotPassword)

    //==========reset password===============

    router.get('/resetPassword', (req, res) => {
      res.render('resetPassword', { title: 'reset password' })
    })

    router.post('/resetPassword', UserController.handleResetPassword)

    //================home==========================

    router.get('/', isAuth, isUserVerified, UserController.getUsersData)

    //==============resendVerfication====================

    router.get('/resendVerificationEmail', (req, res) => {
      res.render('ResendVerificationEmail', {
        title: 'ResendVerificationEmail',
      })
    })

    router.post(
      '/resendVerificationEmail',
      isAuth,
      UserController.resendVerificationEmail
    )

    //===get profile=====================
    router.get(
      '/profile',
      isAuth,
      isUserVerified,
      UserController.getProfileData
    )

    //===== upload profile picture=================
    router.get('/uploadProfilePic', isAuth, isUserVerified, (req, res) => {
      res.render('UploadProfilePic', { title: 'Upload Profile Picture' })
    })

    const upload = multer({
      storage,
      limits: { fileSize: 1024 * 1024 * 8 },
    })

    router.post(
      '/uploadProfilePic',
      isAuth,
      isUserVerified,
      upload.single('profilePic'),
      UserController.uploadProfilePic
    )
  }
)

module.exports = router
