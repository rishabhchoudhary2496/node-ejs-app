const isAuth = function name(req, res, next) {
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

module.exports = {isAuth,isUserVerified}