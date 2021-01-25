const {
  createUser,
  verifyUser,
  handleResetPassword,
  handleForgotPassword,
  getUsersData,
  resendVerificationEmail
} = require('../controllers/userController')
const passport = require('passport')
const { isAuth,isUserVerified } = require('../middlewares/customMiddlewares.js')

module.exports = function (app) {
  // sign up
  app.get('/signUp', (req, res) => {
    res.render('SignUp', {
      title: 'SignUp',
      expressFlash: req.flash('errorMessage'),
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

  //=================================
  //verify account

  app.get('/verifyAccount', (req, res) => {
    res.render('verifyAccount', {
      title: 'verifyAccount',
      expressFlash: req.flash('message'),
    })
  })

  app.post('/verifyAccount', verifyUser)

  //====================================
  //forgot password

  app.post('/forgotPassword', handleForgotPassword)

  //=======================
  //reset password

  app.get('/resetPassword', (req, res) => {
    res.render('resetPassword', { title: 'reset password' })
  })

  app.post('/resetPassword', handleResetPassword)

  //=============================
  //logout

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
  })

  //==============================
  //home

  app.get('/', isAuth, isUserVerified ,getUsersData)

  //==============

  app.get('/resendVerificationEmail',(req,res) =>{
    res.render('ResendVerificationEmail', { title: 'ResendVerificationEmail' })
  })

  app.post('/resendVerificationEmail', isAuth, resendVerificationEmail)
}
