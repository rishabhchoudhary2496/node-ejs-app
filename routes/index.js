module.exports = function (app, wagner) {
  wagner.invoke(
    (
      Comment,
      User,
      validateComment,
      Reply,
      validateReply,
      validateUser,
      generateToken,
      verifyToken,
      decodeToken,
      sendVerificationEmail,
      sendResetPasswordEmail,
      CLIENT_URL,
      passport,
      multer,
      isAuth,
      isUserVerified,
      isLoggedIn,
      UserController,
      ReplyController,
      CommentController,
      storage
    ) => {
      const userController = new UserController(
        User,
        validateUser,
        generateToken,
        verifyToken,
        sendVerificationEmail,
        decodeToken,
        sendResetPasswordEmail,
        CLIENT_URL
      )

      //=============sign up===============
      app.get('/signUp', (req, res) => {
        res.render('SignUp', {
          title: 'SignUp',
          expressFlash: req.flash('errorMessage'),
          layout: './layouts/SignUpLayout',
        })
      })

      app.post('/signUp', isLoggedIn, userController.createUser)

      //=============login===============

      app.get('/login', isLoggedIn, (req, res) => {
        res.render('Login', { title: 'login', message: req.flash('message') })
      })

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

      //=============logout===============

      app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/login')
      })

      //=========verifyAccount=============

      app.get('/verifyAccount', (req, res) => {
        res.render('verifyAccount', {
          title: 'verifyAccount',
          expressFlash: req.flash('message'),
        })
      })

      app.post('/verifyAccount', userController.verifyUser)

      //========forgotPassword=============

      app.post('/forgotPassword', userController.handleForgotPassword)

      //==========reset password===============

      app.get('/resetPassword', (req, res) => {
        res.render('resetPassword', { title: 'reset password' })
      })

      app.post('/resetPassword', userController.handleResetPassword)

      //================home==========================

      app.get('/', isAuth, isUserVerified, userController.getUsersData)

      //==============resendVerfication====================

      app.get('/resendVerificationEmail', (req, res) => {
        res.render('ResendVerificationEmail', {
          title: 'ResendVerificationEmail',
        })
      })

      app.post(
        '/resendVerificationEmail',
        isAuth,
        userController.resendVerificationEmail
      )

      //===get profile=====================
      app.get('/profile', isAuth, isUserVerified, userController.getProfileData)

      //===== upload profile picture=================
      app.get('/uploadProfilePic', isAuth, isUserVerified, (req, res) => {
        res.render('UploadProfilePic', { title: 'Upload Profile Picture' })
      })

      const upload = multer({
        storage,
        limits: { fileSize: 1024 * 1024 * 8 },
      })

      app.post(
        '/uploadProfilePic',
        isAuth,
        isUserVerified,
        upload.single('profilePic'),
        userController.uploadProfilePic
      )

      //=================comment=======================

      const commentController = new CommentController(
        Comment,
        User,
        validateComment
      )
      app.post(
        '/comment',
        isAuth,
        isUserVerified,
        commentController.postComment
      )
      app.get('/comment', isAuth, isUserVerified, commentController.getComment)

      //=================reply=========================
      const replyController = new ReplyController(
        User,
        Comment,
        Reply,
        validateReply
      )
      app.post('/reply', isAuth, isUserVerified, replyController.postReply)
      app.get('/reply', isAuth, isUserVerified, replyController.getReplies)
    }
  )
}
