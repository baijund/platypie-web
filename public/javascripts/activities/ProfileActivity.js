$(document).ready(function(){
  $("#changeButt").click(function(e){
    e.preventDefault();
    console.log("Change buttton clicked");
    $.post("/users/web/editUser",$("#changeForm").serialize(),function(res){

      console.log("Request Succeeded");
      var uname = $("#uname").val();
      var pw = $("#pw").val();
      console.log("Logging in again as " + uname);
      $.post("/users/login", {
        username: uname,
        password: pw
      }, function(){
        alert("Profile Changed");
        console.log("Succeeded!");
      });

    }).fail(function(){

      console.log("Request Failed");

    });

  });
});
