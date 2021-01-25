module.exports.isAuth = function name(req, res, next) {
  if (req.isAuthenticated()) {
      next()
  } else {
    res.redirect('/login');
  }
}

module.exports.isUserVerified = function (req,res,next) {
  const isVerified = req.user.dataValues.isVerified;
    if(isVerified){
      next();
    }
    else{
        res.redirect('/resendVerificationEmail')
    }
}
