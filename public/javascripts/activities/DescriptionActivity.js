$(document).ready(function(){

  $("#ratButt").click(function(){

    var rating = parseFloat($("#myRat").val());
    console.log(rating);
    $.post("/movies/rateMovie", {"rating": rating}, function(response){
    //  alert();
      console.log("Rated movie");
      console.log("Updating in db")
      $.post("/movies/addMovie", {movieString: JSON.stringify(response.movie), majorRatingString: JSON.stringify({id: response.id, major: "EE", rating: 5, count: 5})}, function(response){
        console.log("Added movie");
      });
    })
  });

});
