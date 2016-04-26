currentSearch = [];

$(document).ready(function(){

  var movieList = $("#movies");


  $.get("/movies/getMovieList", function(response){
    movieList.html("").append("<option value=null>Results</option>");
    console.log(response);
    currentSearch = response;
    for(var i = 0; i < response.movies.length; i++){
      movieList.append("<option value='"+i+"'>"+response.movies[i].name+ " (" + response.movies[i].year + ")</option>");
    }
  })

  $( "#movies" ).change(function(e) {
    console.log(e.target.value);
    var mov = currentSearch.movies[parseInt(e.target.value)];
    mov.abridged_cast = mov.actors;
    mov.mpaa_rating = mov.rating_mpaa;
    mov.synopsis = mov.description;
    mov.title = mov.name;
    $.post("/movies/setCurrentMovie", {carrier: mov}, function(){
      console.log("Set the current movie");
      window.location.href = "/description";
    });
  });

});
