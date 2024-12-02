var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var userModel = require('./models/user');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { log } = require('console');
const { hash } = require('crypto');


var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.render("index");

});

app.post('/create',  (req, res) => {
  let {username, email, password, age} = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
       let createdduser = await userModel.create({
          username,
          email,
          password: hash,
          age,
      })

     let token = jwt.sign({email}, "sssssssssssssss");
     res.cookie("token", token);

     res.redirect('/login');
      })        
  })

});



app.get("/logout", function(req, res){
  res.cookie("token", "");
  res.redirect("/");
});


app.get("/login", function(req, res){
 res.render('login');
});


app.post("/login", async function(req, res){
  let user = await userModel.findOne({email: req.body.email})
  if(!user) return res.send("something is wrong");   


   bcrypt.compare(req.body.password,  user.password, function (err, result) {
   if(result) {
      let token = jwt.sign({email: user.email}, "sssssssssssssss");
      res.cookie("token", token);
      res.render("desh");
   }
   
   else res.redirect("login");        
   })

   
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
