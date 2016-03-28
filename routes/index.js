//Allow pg to be accessed from any file
pg = require('pg');

//Declare connection information in global object
CONNNECTION_OBJ = {
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    ssl: true
}

var users = require('./users.js');


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.CurrentUser);
  res.render('index', { title: 'No Chill' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  if(req.session.CurrentUser){
    console.log("CurrentUser exists");
    res.redirect("/loggedin");
    return;
  }
  res.render('login', { title: 'Login' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  // delete req.session.user;
  res.render('register', { title: 'Register' });
});

/* POST users/getUser. */
router.post('/users/getUser', function(req, res, next) {
  // req.session.user = req.body.username;
  // console.log("In get: " + req.session.user);
  if (!req.body.username){
    res.json({invalid: true});
  } else {
    users.getUser(req.body.username, res);
  }
});

/* POST users/addUser */
router.post('/users/addUser', function(req, res, next) {
  var userObjectString = req.body.userObjectString;

  //Make sure the request has a userObjectString
  if (!userObjectString){
    console.log("userObjectString is missing");
    res.json({error: true, errormsg: "Bad post parameters", errorid: "POST"});
  } else {
    var userObject = JSON.parse(userObjectString);
    //Make sure userObject and all its fields are defined
    if (!userObject || !userObject.firstName || !userObject.lastName || !userObject.email || !userObject.username || !userObject.password || !userObject.about || !userObject.major){
      console.log("Something is missing");
      res.json({error: true, errormsg: "Bad user object", errorid: "USER_OBJECT"});
    } else {
      console.log("Nothing is missing");
      users.addUser(userObject, res);
    }
  }
});


/* POST users/login. */
router.post('/users/login', function(req, res, next) {

  console.log("Login attempted");
  //Require username and password fields
  if (!req.body.username || !req.body.password){
    res.json({invalid: true});
  } else {
    users.login(req.body.username, req.body.password, res, req);
  }
});

/* POST users/editUser. */
router.post('/users/editUser', function(req, res, next) {

  console.log("Edit User attempted");
  //Require username and password fields

  //Make sure user is logged in
  if(req.session.CurrentUser){
    //Make sure there is a userObjectString
    var userObjectString = req.body.userObjectString;
    if(userObjectString){
      var userObject = JSON.parse(userObjectString);

      //Make sure userObject and all fields are defined
      if (!userObject || !userObject.firstName || !userObject.lastName || !userObject.email || !userObject.username || !userObject.password || !userObject.about || !userObject.major){
        res.json({error: true, errormsg: "Bad user object", errorid: "USER_OBJECT"});
      } else {
        //Make sure logged in user is the same as requested user
        if(userObject.username === req.session.CurrentUser.username){
          users.editUser(userObject, res);
        } else {
          res.json({error: true, errormsg: "Not logged in as proper user", errorid: "WRONG_USER"});
        }
      }

    } else {
      res.json({error: true, errormsg: "No userObjectString", errorid: "POST"});
    }
  } else {
    res.json({error: true, errormsg: "Not logged in", errorid: "LOGGED_IN"});
  }

});


router.get('/loggedin', function(req, res, next) {
  if(req.session.CurrentUser){
    res.render('loggedin', {title: "Logged in", CurrentUser: req.session.CurrentUser});
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', function(req, res, next){
  delete req.session.CurrentUser;
  res.redirect('/login');
});


module.exports = router;
