$(document).ready(function(){
  $("#regbutt").prop("disabled", false);

  $("#regbutt").click(function(){
    $("#regbutt").prop("disabled", true);


    $.post("/users/web/addUser",$("#registerForm").serialize(),function(res){

      console.log("Request Succeeded");

    }).fail(function(){

      console.log("Request Failed");

    });



  });

});
