currentSearch = [];

$(document).ready(function(){

  var movieList = $("#movies");


  $.get("/movies/getMovieList", function(response){
    movieList.html("").append("<option value=null>Results</option>");;
    console.log(response)
    currentSearch = response;
    for(var i = 0; i < response.movies.length; i++){
      movieList.append("<option value='"+i+"'>"+response.movies[i].name+ " (" + response.movies[i].year + ")</option>");
    }
  })

});
