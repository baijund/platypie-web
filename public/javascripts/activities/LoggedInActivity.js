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

  $("#dvdButt").click(function(e){
    e.preventDefault();
    window.location.href = "/newdvds";
  });

  $("#recButt").click(function(e){
    e.preventDefault();
    window.location.href = "/recommendations";
  });

});
