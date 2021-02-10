const wagner = require('wagner-core')

const { isAuth, isUserVerified, isLoggedIn } = require('./middlewares')
const storage = require('./multerConfig')
const {
  generateToken,
  verifyToken,
  decodeToken,
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require('./generalUtils')

module.exports = function () {
  wagner.factory('isAuth', function () {
    return isAuth
  })

  wagner.factory('isUserVerified', function () {
    return isUserVerified
  })

  wagner.factory('isLoggedIn', function () {
    return isLoggedIn
  })

  wagner.factory('storage', function () {
    return storage
  })

  wagner.factory('generateToken', function () {
    return generateToken
  })

  wagner.factory('verifyToken', function () {
    return verifyToken
  })

  wagner.factory('decodeToken', function () {
    return decodeToken
  })

  wagner.factory('sendVerificationEmail', function () {
    return sendVerificationEmail
  })

  wagner.factory('sendResetPasswordEmail', function () {
    return sendResetPasswordEmail
  })
}
