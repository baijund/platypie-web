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
          res.json({error: true, errormsg:"Database query error in get movie", errorid: "QUERY"});
          return console.error('error running query', err);
        }

        //done();
        var rows = result.rows;

        if (rows.length){
          //res.json({"movie" : rows[0], error: false});
          var movieRow = rows[0];
          q = "SELECT * FROM public.\"majorRatings\" WHERE \"ID\"='" + id + "'";

          client.query(q, function(err, result) {

            if(err) {
              res.json({error: true, errormsg:"Database query error in selecting from ratings", errorid: "QUERY"});
              return console.error('error running query', err);
            }

            done();
            console.log(result);

            result.rows.push({ID: -1, major: "INVALID", rating: -1, count: -1});


            res.json({"movie" : rows, majorRatings: result.rows, error: false});

          });

        } else {
          res.json({error: true, errormsg: "Movie not found", errorid: "NO_MOVIE"});
        }

      });
  });

}

//Add movie (very insecure)
var addMovie = function(movie, majorRating, res){

  console.log("Attempting to add movie");

  //Try to properly format actors
  try{
    movie.actors = "\"" + movie.actors.join("\",\"") + "\"";
  } catch(e){
    console.log(e);
    movie.actors = ["a1", "a2", "a3"];
    movie.actors = "\"" + movie.actors.join("\",\"") + "\"";
  }

  console.log(movie.actors);
  var q = "INSERT INTO public.movies VALUES ('" + movie.name + "','" + movie.year + "','" + movie.rating_mpaa + "','" + movie.id + "','" + movie.description + "','" + movie.averageRating + "','" + movie.numRatings + "','{" + movie.actors + "}');";

  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
      return console.error('could not connect to postgres', err);
    }

    client.query(q, function(err, result) {
        if(err) {
          res.json({error: true, errormsg:"Database query error in addMovie", errorid: "QUERY"});
          return console.error('error running query', err);
        }

        var rowCount = result.rowCount;

        if (!rowCount){
          res.json({error: true, errormsg: "Failed to add movie", errorid: "ADD_MOVIE"});
        } else {

          q = "INSERT INTO public.\"majorRatings\" VALUES('" + movie.id + "','" + majorRating.major + "','" + majorRating.rating + "','" + majorRating.count + "')";
          client.query(q, function(err, result){
            if(err) {
              res.json({error: true, errormsg:"Database query error in majorRatings insertion", errorid: "QUERY"});
              return console.error('error running query', err);
            }
            done();
            res.json({error: false});
          });
        }
      });
  });

}

var addOrUpdateMovie = function(movie, majorRating, res){

  var id = movie.id;
  var q = "SELECT * FROM public.movies WHERE \"ID\"='" + id + "'";

  console.log(movie);

  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
      return console.error('could not connect to postgres', err);
    }

    client.query(q, function(err, result) {
        if(err) {
          res.json({error: true, errormsg:"Database query error in addOrUpdateMovie", errorid: "QUERY"});
          return console.error('error running query', err);
        }

        var rows = result.rows;

        if (rows.length){
          updateMovie(movie, majorRating, res);
        } else {
          addMovie(movie, majorRating, res);
        }

      });
  });
}

var updateMovie = function(movie, majorRating, res){
  //Try to properly format actors
  try{
    movie.actors = "\"" + movie.actors.join("\",\"") + "\"";
  } catch(e){
    movie.actors = ["a1", "a2", "a3"];
    movie.actors = "\"" + movie.actors.join("\",\"") + "\"";
  }
  var q = "UPDATE public.movies SET \"ID\"='" + movie.id + "', name='" + movie.name + "', year='" + movie.year + "', rating_mpaa='" + movie.rating_mpaa + "', description='" + movie.description + "', \"averageRating\"='" + movie.averageRating +  "', \"numRatings\"='" + movie.numRatings + "', actors='{" + movie.actors + "}' WHERE \"ID\"='" + movie.id + "'";

  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
      return console.error('could not connect to postgres', err);
    }

    client.query(q, function(err, result) {
        if(err) {
          console.log(q);
          res.json({error: true, errormsg:"Database query error in updateMovie", errorid: "QUERY"});
          return console.error('error running query', err);
        }


        q = "SELECT * FROM public.\"majorRatings\" WHERE \"ID\"='" + movie.id + "' AND major='" + majorRating.major + "';";

        client.query(q, function(err, result) {
            if(err) {
              res.json({error: true, errormsg:"Database query error in updateMovie2", errorid: "QUERY"});
              console.log(q);
              return console.error('error running query', err);
            }

            console.log(q);
            // console.log(result.rows);
            if(result.rows.length){
              q = "UPDATE public.\"majorRatings\" SET \"ID\"='" + movie.id + "', major='" + majorRating.major + "', rating='" + majorRating.rating + "', count='" + majorRating.count + "' WHERE \"ID\"='" + movie.id + "' AND major='" + majorRating.major + "';";
            } else {
              q = "INSERT INTO public.\"majorRatings\" VALUES('" + movie.id + "','" + majorRating.major + "'," + majorRating.rating + "," + majorRating.count + ");";
            }

            // console.log(q);
            // console.log(result.rows.length);

            client.query(q, function(err, result) {
                if(err) {
                  res.json({error: true, errormsg:"Database query error in updateMovie3", errorid: "QUERY"});
                  console.log(q);
                  return console.error('error running query', err);
                }

                done();
                res.json({error: false});

              });

          });
      });
  });
}

var getMovieList = function(res){
  var q = "SELECT * FROM public.movies;";
  pg.connect(CONNNECTION_OBJ, function(err, client, done) {
    if(err) {
      res.json({error: true, errormsg:"Database connection error", errorid: "DB_CON_ERROR"});
      return console.error('could not connect to postgres', err);
    }

    client.query(q, function(err, result) {
        if(err) {
          res.json({error: true, errormsg:"Database query error in getMovieList", errorid: "QUERY"});
          return console.error('error running query', err);
        }

        var rowCount = result.rowCount;

        if (!rowCount){
          res.json([]);
        } else {

          var movieRows = result.rows;
          q = "SELECT * FROM public.\"majorRatings\";";
          client.query(q, function(err, result){
            if(err) {
              res.json({error: true, errormsg:"Database query error in getMovieList2", errorid: "QUERY"});
              return console.error('error running query', err);
            }
            done();

            var returnObj = {error: false, movies: []};

            for(var i = 0; i < movieRows.length; i++){
              returnObj.movies[i] = movieRows[i];
              returnObj.movies[i].majorRatings = [];
              for(var j = 0; j < result.rows.length; j++){
                //console.log(result.rows[j]);
                if(result.rows[j].ID == returnObj.movies[i].ID){
                  returnObj.movies[i].majorRatings.push(result.rows[j]);
                }
              }
            }

            res.json(returnObj);
          });
        }
      });
  });
}

module.exports = {
  "getMovie": getMovie,
  "addMovie": addOrUpdateMovie,
  "getMovieList": getMovieList,
  "updateMovie": updateMovie
};
