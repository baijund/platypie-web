$(document).ready(function(){

  $("#profButt").click(function(e){
    e.preventDefault();
    window.location.href = "/profile";
  });

  $("#searchButt").click(function(e){
    e.preventDefault();
    window.location.href = "/search";
  });

  $("#relButt").click(function(e){
    e.preventDefault();
    window.location.href = "/newreleases";
  });

});
