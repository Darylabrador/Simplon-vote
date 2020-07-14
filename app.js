var createError    = require('http-errors');
var express        = require('express');
var path           = require('path');
var cookieParser   = require('cookie-parser');
var logger         = require('morgan');

const mongoose     = require('mongoose');
const dotenv       = require('dotenv').config();
const session      = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf         = require('csurf');

// MongoDB configuration
var configDB    = require('./config/database.js');

// Routes
const authRoutes = require('./routes/auth');

var app = express();

// Add robust session handler
const store = new MongoDBStore({
  uri: configDB.url,
  collection: 'sessions'
});

// Security
const csrfProtection = csrf();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Simple session : Need more secure at the end
app.use(
  session({
    name: 'simplonVote',
    secret: ['asq4b4PR', 'blu3ey3spictures', '4lotofw0rdind3spair'],
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 1 * 60 * 60 * 1000 // 1 hour
    },
    store: store
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes handler
app.use('/', authRoutes);

// error handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).render('error',{
    message: message,
    status: status
  });
})

// Connection to mongoDB using moongose
mongoose.connect(configDB.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => {
  console.log('connection to database established successfully')
})
.catch(err =>{
  console.log('An error occursed ', err);
});

module.exports = app;