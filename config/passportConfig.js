const LocalStrategy = require('passport-local').Strategy
const { User } = require('../models')
const bcrypt = require('bcrypt')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ where: { email: email } })
          if (!user)
            return done(null, false, {
              'message': 'Email or Password is Incorrect',
            })

          const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
          )
        
          if (!isPasswordMatched)
            return done(null, false, {
              'message': 'Email or Password is Incorrect',
            })

          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id: id } })
      if (user) return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
}
