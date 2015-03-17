$(document).ready(function(){

    Parse.initialize("SBYhfUbIzN4jFYOYCg5acXyhZ6DAZjEMPmxPhcZM", "ACJPWbfahWN1jT40NUKjtJgJhJlBaQw4NvHe4q0k");
    $("#container").css("overflow-x:hidden; overflow-y:scroll;");
    
    $("#register_user_btn").on("click",function(event){
        var form = event.originalEvent.target.form; 
        console.log ('register_user_btn function');
        var user = new Parse.User();
        user.set("username", form.username.value);
        user.set("password", form.pwd.value);
        user.set("attempts_recorded", 0);
        var rand_pass = Math.floor(Math.random()*8999+1000);
        var pass_arr = (rand_pass + '').split('');
        console.log('pass_arr: ' + pass_arr);
        user.set('associated_password', pass_arr);
        user.signUp(null, {
          success: function(user) {
            window.open('index.html',"_top")
          },
          error: function(user, error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
    });

    $("#login_user_btn").on("click",function(event){
        var form = event.originalEvent.target.form; 
        console.log ('login_user_btn function');
        Parse.User.logIn(form.userid.value, form.pswrd.value, {
          success: function(user) {
            window.open('index.html',"_top")
          },
          error: function(user, error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
    });
});