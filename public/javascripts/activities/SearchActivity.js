var currentSearch = [];
var s = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=7wj4raxmwrr475d3na6ujxbr&q="
$(document).ready(function(){


  var movieList = $("#movies");

  $("#searchButt").click(function(e){
    e.preventDefault();
    movieList.html("");
    $.ajax({
      url: s+$("#search").val(),

      dataType: "jsonp",
      success: function( response ) {
        movieList.html("").append("<option value=null>Results</option>");;
        console.log(response)
        currentSearch = response;
        for(var i = 0; i < response.movies.length; i++){
          movieList.append("<option value='"+i+"'>"+response.movies[i].title+ " (" + response.movies[i].year + ")</option>");
        }

      }

      });
  });

  $( "#movies" ).change(function(e) {
    console.log(e.target.value);
    var mov = currentSearch.movies[parseInt(e.target.value)];

    $.post("/movies/getMovie", {id: mov.id}, function(response){
      if(response.error){
        mov.numRatings = 0;
        $.post("/movies/setCurrentMovie",{carrier: JSON.stringify(mov)}, function(){
          console.log("Set the current movie");
          window.location.href = "/description";
        });
      } else {
        mov.abridged_cast = response.movie[0].actors;
        mov.mpaa_rating = response.movie[0].rating_mpaa;
        mov.synopsis = response.movie[0].description;
        mov.title = response.movie[0].name;
        mov.averageRating = response.movie[0].averageRating;
        mov.numRatings = response.movie[0].numRatings;
        $.post("/movies/setCurrentMovie",{carrier: JSON.stringify(mov)}, function(){
          console.log(mov);
          window.location.href = "/description";
        });
      }
    });
  });

});
