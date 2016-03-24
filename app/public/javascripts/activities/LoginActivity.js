$(document).ready(function(){
  console.log("Login Page Loaded");
  $("#loginForm").ajaxForm({url: 'users', type: 'post', success: loginSuccess})
});

function loginSuccess(responseText, statusText, xhr, $form){
  console.log("Success");
}
