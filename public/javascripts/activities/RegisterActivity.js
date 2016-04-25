$(document).ready(function(){
  $("#regbutt").prop("disabled", false);

  $("#regbutt").click(function(){
    $("#regbutt").prop("disabled", true);
    a = $("#registerForm").serialize();
    b = new FormData(document.querySelector("#registerForm"));
    console.log(b);



    $("#registerSubmit").serialize() // returns all the data in your form
    $.post("/RegisterActivity",$("#registerForm").serialize(),function(){
        console.log("wut")
    });


  });

});
