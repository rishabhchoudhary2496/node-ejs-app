const passport = require('passport')
const multer = require('multer')
const {
  createUser,
  verifyUser,
  handleResetPassword,
  handleForgotPassword,
  getUsersData,
  resendVerificationEmail,
  getProfileData,
  uploadProfilePic,
} = require('../controllers/userController')

const { getReplies, postReply } = require('../controllers/replyController')
const { postComment, getComments } = require('../controllers/commentController')

const { isAuth, isUserVerified } = require('../utils/middlewares')

const { storage } = require('../config/multerConfig')
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 8 },
})

module.exports = function (app, wagner) {
  // sign up
  app.get('/signUp', (req, res) => {
    res.render('SignUp', {
      title: 'SignUp',
      expressFlash: req.flash('errorMessage'),
      layout: './layouts/SignUpLayout',
    })
  })

  app.post('/signUp', createUser)

  //================================

  //login

  app.get('/login', (req, res) => {
    res.render('Login', { title: 'login', message: req.flash('message') })
  })

  //login functionality
  app.post('/login', (req, res, next) => {
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

  //=========verifyAccount=============

  app.get('/verifyAccount', (req, res) => {
    res.render('verifyAccount', {
      title: 'verifyAccount',
      expressFlash: req.flash('message'),
    })
  })

  app.post('/verifyAccount', verifyUser)

  //========forgotPassword=============

  app.post('/forgotPassword', handleForgotPassword)

  //==========reset password===============

  app.get('/resetPassword', (req, res) => {
    res.render('resetPassword', { title: 'reset password' })
  })

  app.post('/resetPassword', handleResetPassword)

  //=============logout===============

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
  })

  //================home==========================

  app.get('/', isAuth, isUserVerified, getUsersData)

  //==============resendVerfication====================

  app.get('/resendVerificationEmail', (req, res) => {
    res.render('ResendVerificationEmail', { title: 'ResendVerificationEmail' })
  })

  app.post('/resendVerificationEmail', isAuth, resendVerificationEmail)

  //===profile=====================
  app.get('/profile', isAuth, isUserVerified, getProfileData)

  //upload pic page
  app.get('/uploadProfilePic', isAuth, isUserVerified, (req, res) => {
    res.render('UploadProfilePic', { title: 'Upload Profile Picture' })
  })

  //===== upload profile picture=================

  app.post(
    '/uploadProfilePic',
    isAuth,
    isUserVerified,
    upload.single('profilePic'),
    uploadProfilePic
  )

  //=================comment=======================
  app.post('/comment', isAuth, isUserVerified, postComment)
  app.get('/comment', isAuth, isUserVerified, getComments)

  //=================reply=========================
  app.post('/reply', isAuth, isUserVerified, postReply)
  app.get('/reply', isAuth, isUserVerified, getReplies)
}
