$(document).ready(function(){

    Parse.initialize("SBYhfUbIzN4jFYOYCg5acXyhZ6DAZjEMPmxPhcZM", "ACJPWbfahWN1jT40NUKjtJgJhJlBaQw4NvHe4q0k");
    $("#container").css("overflow-x:hidden; overflow-y:scroll;");
    
    $("#register_user_btn").on("click",function(){
    // function register_new_user(form) { 
        var form = event.originalEvent.target.form; 
        var user = new Parse.User();
        user.set("username", form.username.value);
        user.set("password", form.pwd.value);
         
        user.signUp(null, {
          success: function(user) {
            window.open('www.usandeep1.github.io/index.html')
          },
          error: function(user, error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
    }

    $("#register_user_btn").on("click",function(){
    // function login_user(form) { 
        var form = event.originalEvent.target.form; 
        Parse.User.logIn(form.userid.value, form.pswrd.value, {
          success: function(user) {
            window.open('www.usandeep1.github.io/index.html')
          },
          error: function(user, error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
    }
});