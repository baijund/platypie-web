var s = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=7wj4raxmwrr475d3na6ujxbr&q=frozen"
$(document).ready(function(){

  $.get(s,function(data){
    alert(data);
  })

  var movieList = $("#movies");

  $("#searchButt").click(function(e){
    e.preventDefault();

    for(var i = 0; i < 10; i++){
      movieList.append("<option value='i'>"+i+"</option>");

    }



  });

});
