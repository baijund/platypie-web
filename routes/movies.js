//Get movie
var getMovie = function(id, res){
  var q = "SELECT * FROM public.movies WHERE \"ID\"='" + id + "'";

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
        var rows = result.rows;

        if (rows.length){
          res.json({"movie" : rows[0], error: false});
        } else {
          res.json({error: true, errormsg: "Movie not found", errorid: "NO_MOVIE"});
        }

      });
  });

}

//Add movie (very insecure)
var addMovie = function(movie, majorRating, res){

  movie.actors = "\"" + movie.actors.join("\",\"") + "\"";
  console.log(movie.actors);
  var q = "INSERT INTO public.movies VALUES ('" + movie.name + "','" + movie.year + "','" + movie.rating_mpaa + "','" + movie.id + "','" + movie.description + "','" + movie.averageRating + "','" + movie.numRatings + "','{" + movie.actors + "}');";

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

        var rowCount = result.rowCount;

        if (!rowCount){
          res.json({error: true, errormsg: "Failed to add movie", errorid: "ADD_MOVIE"});
        } else {

          q = "INSERT INTO public.\"majorRatings\" VALUES('" + movie.id + "','" + majorRating.major + "','" + majorRating.rating + "','" + majorRating.count + "')";
          client.query(q, function(err, result){
            if(err) {
              res.json({error: true, errormsg:"Database query error", errorid: "QUERY"});
              return console.error('error running query', err);
            }
            done();
            res.json({error: false});
          });
        }
      });
  });

}


module.exports = {
  "getMovie": getMovie,
  "addMovie": addMovie
};
