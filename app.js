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
const flash        = require('connect-flash');

// MongoDB configuration
var configDB    = require('./config/database.js');

// Routes
const authRoutes = require('./routes/auth');

// error controller 
const errorController = require('./controllers/errorController');
const User            = require('./models/users');

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

// Simple session
app.use(
  session({
    name: 'simplonVote',
    secret: 'asq4b4PR',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());

// pass variables locally
app.use((req, res, next) =>{
  if (!req.session.userId) {
    return next();
  }
  User.findById(req.session.userId)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      res.locals.currentUser = user.pseudo;
      next();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
});

app.use((req, res, next) => {
  res.locals.success_message = req.flash('success');
  res.locals.error_message   = req.flash('error');
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken       = req.csrfToken();
  next();
});

// Routes handler
app.use(authRoutes);

app.use(errorController.get404);

// general error handler (all except 404)
app.use((error, req, res, next) => {
  res.status(error.httpStatusCode).render('error', {
    title: 'Une erreur est servenue',
    path: '/errors',
    statusCode: error.httpStatusCode
  });
});

// Connection to mongoDB using moongose
mongoose.connect(configDB.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => {
  console.log('connection to database established successfully');
})
.catch(err =>{
  console.log('An error occursed ', err);
});

module.exports = app;