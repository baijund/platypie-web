$(document).ready(function(){

  $("#reqButt").click(function(e){
    e.preventDefault();
    console.log("Click");
    var uname = $("#uname").val();
    $.post("/users/forgot", {username: uname}, function(){
      console.log("SUCCESS");
    });

  })

});
