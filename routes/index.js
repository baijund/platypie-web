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
var movies = require('./movies.js')

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

/* GET profile page. */
router.get('/profile', function(req, res, next) {
  if(!req.session.CurrentUser){
    console.log("Not logged in");
    res.redirect("/login");
    return;
  }
  console.log(req.session.CurrentUser);
  res.render('profile', { title: 'Profile', user: req.session.CurrentUser });
});

/* GET newreleases page. */
router.get('/newreleases', function(req, res, next) {
  if(!req.session.CurrentUser){
    console.log("Not logged in");
    res.redirect("/login");
    return;
  }
  console.log(req.session.CurrentUser);
  res.render('newreleases', { title: 'New Releases', user: req.session.CurrentUser });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  // delete req.session.user;
  res.render('register', { title: 'Register' });
});

/* GET register page. */
router.get('/search', function(req, res, next) {
  if(!req.session.CurrentUser){
    console.log("Not logged in");
    res.redirect("/login");
    return;
  }
  res.render('search', { title: 'Search' });
});

/* POST users/web/addUser. */
router.post('/users/web/addUser', function(req, res, next) {
  var parms = req.body;


  var userObject = {};
  userObject.firstName = parms.fname;
  userObject.lastName = parms.lname;
  userObject.email = parms.email;
  userObject.password = parms.pass;
  userObject.about = parms.about;
  userObject.major = parms.major;
  userObject.username = parms.uname;
  if (!userObject || !userObject.firstName || !userObject.lastName || !userObject.email || !userObject.username || !userObject.password || !userObject.about || !userObject.major){
    console.log("Something is missing");
    res.json({error: true, errormsg: "Bad user object", errorid: "USER_OBJECT"});
  } else {
    console.log("Nothing is missing");
    users.addUser(userObject, res);
  }
});

/* POST users/web/getUser. */
router.post('/users/web/editUser', function(req, res, next) {
  var parms = req.body;

  if(!req.session.CurrentUser){
    console.log("Not logged in");
    res.json({error: true, errorid: "LOGIN"});
    return;
  }

  var currUser = req.session.CurrentUser;

  console.log(currUser);

  var userObject = {};
  userObject.firstName = parms.fname;
  userObject.lastName = parms.lname;
  userObject.email = parms.email;
  userObject.password = currUser.password;
  userObject.about = parms.about;
  userObject.major = parms.major;
  userObject.username = currUser.username;
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


/* POST users/getUnbannedUsers. */
router.post('/users/getUnbannedUsers', function(req, res, next) {
  users.getUnbannedUsers(res);
});

/* POST users/getBannedUsers. */
router.post('/users/getBannedUsers', function(req, res, next) {
  users.getBannedUsers(res);
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


/* POST movies/getMovie. */
router.post('/movies/getMovie', function(req, res, next) {
  var id = parseInt(req.body.id);
  //Check for id
  if(id){
    movies.getMovie(id, res);
  } else {
    res.json({error: true, errormsg: "id is missing", errorid: "NO_ID"})
  }
});

/* POST movies/addMovie. */
router.post('/movies/addMovie', function(req, res, next) {

  var movieString = req.body.movieString;
  var majorRatingString = req.body.majorRatingString;
  if(!movieString){
    res.json({error: true, errormsg: "Movie string missing", errorid: "MOVIE_STRING"})
  } else if (!majorRatingString){
    res.json({error: true, errormsg: "Major string missing", errorid: "MAJOR_STRING"})
  } else{
    var movie = JSON.parse(movieString);
    var majorRating = JSON.parse(majorRatingString);
    //Add or update movie
    movies.addMovie(movie, majorRating, res);
  }

});


/* POST movies/setCurrentMovie */
router.post('/movies/setCurrentMovie', function(req, res, next) {

  var parms = req.body;

  if(parms){
    req.session.CurrentMovie = parms;
    res.json({error: false});
  } else {
    res.json({error: true});
  }

});


/* GET movies/getMovieList. */
router.get('/movies/getMovieList', function(req, res, next) {

  movies.getMovieList(res);

});

/* GET description. */
router.get('/description', function(req, res, next) {

  if(!req.session.CurrentMovie || !req.session.CurrentUser){
    res.redirect('/');
  } else {
    res.render('description', {title: "Description", movie:req.session.CurrentMovie});
  }

});

router.post('/movies/updateMovie', function(req, res, next){
  var movieString = req.body.movieString;
  var majorRatingString = req.body.majorRatingString;
  if(!movieString){
    res.json({error: true, errormsg: "Movie string missing", errorid: "MOVIE_STRING"})
  } else if (!majorRatingString){
    res.json({error: true, errormsg: "Major string missing", errorid: "MAJOR_STRING"})
  } else{
    var movie = JSON.parse(movieString);
    var majorRating = JSON.parse(majorRatingString);
    movies.updateMovie(movie, majorRating, res);
  }
});


module.exports = router;
