const userRoute = require('./userRoute')
const commentRoute = require('./commentRoute')
const replyRoute = require('./replyRoute')

module.exports = function (app) {
  app.use('/', userRoute)
  app.use('/comment', commentRoute)
  app.use('/reply', replyRoute)
}
