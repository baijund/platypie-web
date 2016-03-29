
//Takes in username and Response object to generate JSON response of user profile without password
var getUser = function(username, res){

  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
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
          res.json({error: true, errormsg:"Database query error", errorid: "QUERY"});
          return console.error('error running query', err);
        }

        done();

        var row = result.rows[0];
        //console.log(row);
        if (!row){
          res.json({error: true, errormsg:"User not found", errorid: "NO_USER"});
        } else {
          row.error = false;
          res.json(row);
        }
      });
  });
}


//Helper to determine if user is in db
function userExists(userObject, client, existFunc, notExistFunc, errorFunc){
  console.log("Checking existence");
  var q = "SELECT * FROM public.users WHERE username='" + userObject.username + "';";

  client.query(q, function(err, result) {
      if(err) {
        console.error('error running query', err);
        errorFunc();
      } else {
        var rows = result.rows;
        var rowlen = rows.length;
        console.log("Row length is: " + rowlen);
        if (rowlen){
          existFunc();
        } else {
          notExistFunc();
        }
      }
    });
}

//Takes in a UserObject and Response object and adds the user to the database..
var addUser = function(userObject, res){
  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
      return console.error('could not connect to postgres', err);
    }

    var errorFunc = function(){
      res.json({error: true, errormsg:"Database query error when checking existence", errorid: "QUERY"});
      done();
    }

    var existFunc = function(){
      res.json({error: true, errormsg: "User exists", errorid:"USER_EXISTS"});
      done();
    }

    var notExistFunc = function(){
      var q = "INSERT INTO public.users VALUES ('" + userObject.firstName + "', '" + userObject.lastName + "', '" + userObject.email + "', '" + userObject.username + "', '" + userObject.password + "', '" + userObject.about + "', '" + userObject.major + "', false, false, false);";

      //console.log("Query: " + q);

      client.query(q, function(err, result) {
          if(err) {
            res.json({error: true, errormsg:"Database query error", errorid: "QUERY"});
            return console.error('error running query', err);
          }

          done();

          var rowCount = result.rowCount;

          if (!rowCount){
            res.json({error: true, errormsg: "Failed to add user", errorid: "ADD_USER"});
          } else {
            res.json({error: false});
          }
        });
    }

    userExists(userObject, client, existFunc, notExistFunc, errorFunc);

  });
}

//Takes in String username, String password, and Repsonse res. Renders Profile object with error: false if succeeded.
//Renders {error:true, errormsg: , errorid} if failed
var login = function(username, password, res, req){
  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
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
                  username='" + username + "' AND password='" + password + "';";

    console.log("Query: " + q);

    client.query(q, function(err, result) {
        if(err) {
          res.json({error: true, errormsg:"Database query error", errorid: "QUERY"});
          return console.error('error running query', err);
        }

        done();

        var row = result.rows[0];
        console.log(row);
        if (!row){
          res.json({error: true, errormsg:"Invalid login", errorid: "BAD_LOGIN"});
        } else {
          row.invalid = false;
          //Set session variable if not banned
          if(!row.banned){
            req.session.CurrentUser = row;
            row.error = false;
            res.json(row);
          } else {
            res.json({error: true, errormsg:"User is banned", errorid: "BANNED"})
          }

        }
      });
  });
}

//Takes in a Response object and renders an array of Strings representing the users (incomplete, probably not needed)
var getUserList = function(res){

}

//Takes in a Response object and renders an array of Strings representing the banned users except superadmin
var getBannedUsers = function(res){
  var q = "SELECT username FROM public.users WHERE superadmin='f' AND banned='t'";

  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
      return console.error('could not connect to postgres', err);
    }

    client.query(q, function(err, result) {
        if(err) {
          res.json({error: true, errormsg:"Database query error", errorid: "QUERY"});
          return console.error('error running query', err);
        }

        done();
        var entries = result.rows;
        res.json({"entries" : entries, error: false});
      });
  });
}

//Takes in a Response object and renders an array of Strings representing the unbanned users except superadmin
var getUnbannedUsers = function(res){
  var q = "SELECT username FROM public.users WHERE superadmin='f' AND banned='f'";

  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
      return console.error('could not connect to postgres', err);
    }

    client.query(q, function(err, result) {
        if(err) {
          res.json({error: true, errormsg:"Database query error", errorid: "QUERY"});
          return console.error('error running query', err);
        }

        done();
        var entries = result.rows;
        res.json({"entries" : entries, error: false});
      });
  });
}

//Takes in a String representing the username of an admin, and a response object. (Incomplete)
var unadmin = function(username, res){

}

//Takes in userObject and updates entry in database
var editUser = function(userObject, res){
  var q = "UPDATE public.users SET firstname='" + userObject.firstName + "', lastname='" + userObject.lastName + "', email='" + userObject.email + "', aboutme='" + userObject.about + "', major='" + userObject.major + "' WHERE username='" + userObject.username + "'";

  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
      return console.error('could not connect to postgres', err);
    }

    client.query(q, function(err, result) {
        if(err) {
          res.json({error: true, errormsg:"Database query error", errorid: "QUERY"});
          return console.error('error running query', err);
        }

        done();
        res.json({error: false});
      });
  });

}



module.exports = {
  "getUser": getUser,
  "addUser": addUser,
  "login": login,
  "editUser": editUser,
  "getUnbannedUsers": getUnbannedUsers,
  "getBannedUsers": getBannedUsers
}
