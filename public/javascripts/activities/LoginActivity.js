$(document).ready(function(){
  console.log("Login Page Loaded");
  $("#loginForm").ajaxForm({url: 'users', type: 'post', success: loginReqSuccess, error: loginError})
});

function loginReqSuccess(responseText, statusText, xhr, $form){
  $(".alert").hide();
  //$("#success").fadeIn();
  console.log("Successfully retreived data from users");
  if (responseText.valid){
    $("#success").fadeIn();
  } else {
    $("#incorrect").fadeIn();
  }
}

function loginError(){
  $(".alert").hide();
  $("#error").fadeIn();
  console.log("Error retreiving data from users");
}
