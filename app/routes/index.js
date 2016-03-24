var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'No Chill' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'No Chill' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'No Chill' });
});

module.exports = router;
