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
  console.log(req.session.user);
  res.render('index', { title: 'No Chill' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
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
    res.json({invalid: true});
  } else {
    var userObject = JSON.parse(userObjectString);
    //Make sure userObject and all its fields are defined
    if (!userObject || !userObject.firstName || !userObject.lastName || !userObject.email || !userObject.username || !userObject.password || !userObject.about || !userObject.major){
      console.log("Something is missing");
      console.log(userObject.firstName & userObject.lastName );
      res.json({invalid: true});
    } else {
      console.log("Nothing is missing");
      users.addUser(userObject, res);
    }
  }
});


/* POST users/login. */
router.post('/users/login', function(req, res, next) {
  //Require username and password fields
  if (!req.body.username || !req.body.password){
    res.json({invalid: true});
  } else {
    users.login(req.body.username, req.body.password, res);
  }
});



module.exports = router;
