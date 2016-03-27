
//Takes in username, password, and response object to generate JSON response of user profile or {invalid: true}
var getUser = function(username, password, res){

  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }

    var q = "SELECT\
                  users.firstname,\
                  users.lastname,\
                  users.email,\
                  users.username,\
                  users.password,\
                  users.aboutme,\
                  users.major,\
                  users.banned,\
                  users.admin,\
                  users.superadmin\
                FROM\
                  public.users\
                WHERE\
                  username='" + username + "' AND password='" + password + "';";

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




module.exports = {
  "getUser": getUser
}
