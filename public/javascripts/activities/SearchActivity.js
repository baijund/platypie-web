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
    $.post("/movies/setCurrentMovie",currentSearch.movies[parseInt(e.target.value)], function(){
      console.log("Set the current movie");
      window.location.href = "/description";
    });
  });

});
