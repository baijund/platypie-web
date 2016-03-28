
//Takes in username and Response object to generate JSON response of user profile without password or {invalid: true}
var getUser = function(username, res){

  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }

    var q = "SELECT\
                  users.firstname,\
                  users.lastname,\
                  users.email,\
                  users.username,\
                  users.aboutme,\
                  users.major,\
                  users.banned,\
                  users.admin,\
                  users.superadmin\
                FROM\
                  public.users\
                WHERE\
                  username='" + username + "';";

    client.query(q, function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }

        done();

        var row = result.rows[0];
        //console.log(row);
        if (!row){
          res.json({invalid: true});
        } else {
          row.invalid = false;
          res.json(row);
        }
      });
  });
}

//Takes in a UserObject and Response object and adds the user to the database. A JSON response of {invalid: true} is generated if it failed. A response of {invalid: false} is generated if it succeeds.
var addUser = function(userObject, res){
  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }

    //var q = "﻿INSERT INTO public.users VALUES ('" + userObject.firstName + "', '" + userObject.lastName + "', '" + userObject.email + "', '" + userObject.username + "', '" + userObject.password + "', '" + userObject.about + "', '" + userObject.major + "', false, false, false);";

    //q = "INSERT INTO public.users VALUES ('fires', 'last', 'Admin@Admindsa.com', 'admdsasin', 'password', 'I am an admin', 'Physics', false, true, true);";

    var q = "INSERT INTO public.users VALUES ('" + userObject.firstName + "', '" + userObject.lastName + "', '" + userObject.email + "', '" + userObject.username + "', '" + userObject.password + "', '" + userObject.about + "', '" + userObject.major + "', false, false, false);";

    console.log("Query: " + q);

    client.query(q, function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }

        done();

        var row = result.rows[0];
        //console.log(row);
        if (!row){
          res.json({invalid: true});
        } else {
          row.invalid = false;
          res.json(row);
        }
      });
  });
}

//Takes in String username, String password, and Repsonse res. Renders {error: false} if succeeded and sets session cookies.
var login = function(username, password, res){
  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }

    var q = "SELECT\
                  users.firstname,\
                  users.lastname,\
                  users.email,\
                  users.username,\
                  users.aboutme,\
                  users.major,\
                  users.banned,\
                  users.admin,\
                  users.superadmin\
                FROM\
                  public.users\
                WHERE\
                  username='" + username + "';";

    client.query(q, function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }

        done();

        var row = result.rows[0];
        //console.log(row);
        if (!row){
          res.json({invalid: true});
        } else {
          row.invalid = false;
          res.json(row);
        }
      });
  });
}

//Takes in a Response object and renders an array of Strings representing the users (incomplete)
var getUserList = function(res){

}

//Takes in a Response object and renders an array of Strings representing the banned users except superadmin (incomplete)
var getBannedUsers = function(res){

}

//Takes in a Response object and renders an array of Strings representing the unbanned users except superadmin (incomplete)
var getUnbannedUSers = function(res){

}

//Takes in a String representing the username of an admin, and a response object. Renders a {error: false} if successful or else a {error: false, errormsg: (SOME MESSAGE)}
var unadmin = function(username, res){

}



module.exports = {
  "getUser": getUser,
  "addUser": addUser
}
