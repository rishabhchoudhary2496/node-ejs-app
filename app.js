const path = require('path');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session')
const cors = require('cors')
const app = express();
const flash = require('connect-flash')
const {sequelize} = require('./models')
const authDB = require('./config/authDB')
const SequelizeStore = require("connect-session-sequelize")(session.Store)
const passport = require('passport')
require('./config/passportConfig')(passport)


app.use(
  session({
    secret: 'MySession',
    resave:false,
    saveUninitialized:true,
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

// app.use((req,res,next) => {
//   console.log("session",req.session);
//   console.log("user",req.user);
//   next();
// })


app.use('/css', express.static('public/css'))
app.use('/img', express.static('public/img'))
app.use('/js', express.static('public/js'))
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', './layouts/FullWidthLayout')
require('./routes')(app)



const PORT = process.env.PORT || 5000;

app.listen(PORT,'localhost',async () => {
    console.log(`Listening on PORT ${PORT}`);
    await sequelize.sync();
    authDB(sequelize)
    console.log('Database Connected')
})