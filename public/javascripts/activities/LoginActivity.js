$(document).ready(function(){
  console.log("Login Page Loaded");
  $("#loginForm").ajaxForm({url: 'users/getUser', type: 'post', success: loginReqSuccess, error: loginReqError})
});

function loginReqSuccess(responseText, statusText, xhr, $form){
  $(".alert").hide();
  //$("#success").fadeIn();
  console.log("Successfully retreived data from users");
  if (!responseText.invalid){
    $("#success").fadeIn();
  } else {
    $("#incorrect").fadeIn();
  }
}

function loginReqError(){
  $(".alert").hide();
  $("#error").fadeIn();
  console.log("Error retreiving data from users");
}
