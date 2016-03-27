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


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'No Chill' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/* POST users/getUser. */
router.post('/users/getUser', function(req, res, next) {
  var users = require('./users.js');
  var profile = users.getUser(req.body.username, res);
});


module.exports = router;
