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
        console.log(response)
        for(var i = 0; i < response.movies.length; i++){
          movieList.append("<option value='"+response.movies[i].id+"'>"+response.movies[i].title+ " (" + response.movies[i].year + ")</option>");
        }

      }

      });




  });

});
