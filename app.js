const path = require('path')
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const cors = require('cors')
const app = express()
const flash = require('connect-flash')
const { sequelize } = require('./models')
const wagner = require('wagner-core')
const passport = require('passport')
require('./bootstrap.js')()
const dbConnect = require('./utils/dbConnect')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
require('./utils/passportConfig')(wagner)

app.use(
  session({
    secret: 'MySession',
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
)
app.use(express.json())
app.use(cors())
app.use(expressLayout)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use('/public', express.static(path.resolve(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', './layouts/FullWidthLayout')
require('./routes/index')(app, wagner)

const PORT = process.env.PORT || 5000

app.listen(PORT, 'localhost', async () => {
  console.log(`Listening on PORT ${PORT}`)
  await sequelize.sync()
  dbConnect(sequelize)
  console.log('Database Connected')
})
