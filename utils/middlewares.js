const isAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

const isUserVerified = function (req, res, next) {
  const isVerified = req.user.dataValues.isVerified
  if (isVerified) {
    next()
  } else {
    res.redirect('/resendVerificationEmail')
  }
}

const isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    next()
  }
}

module.exports = { isAuth, isUserVerified, isLoggedIn }
