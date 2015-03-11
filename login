<!DOCTYPE html>

<html>
    <head>
        <title>Login page</title>
    </head>

</body>
    <body>
        <h1>New User</h1>
	<form tag="Create Login">
		<div align="left">
			Username  : <input type="username" name="username" />
                        <br/><br/>
			Password   : <input type="password" name="pwd" />
 
		<input type="submit" value="Register" />
		</div>
	</form>
        
        <h1>User Login Page</h1>
        <form name="login">
            Username <input type="text" name="userid"/><br/><br/>
            Password  <input type="password" name="pswrd"/>
            <input type="button" onclick="check(this.form)" value="Login"/>
        </form>
        <script language="javascript">
            function check(form) { /*function to check userid & password*/
                /*the following code checks whether the entered userid and password are matching*/
                if(form.userid.value == "myuserid" && form.pswrd.value == "mypswrd") {
                    window.open('www.usandeep1.github.io')/*opens the target page while Id & password matches*/
                }
                else {
                    alert("Error Password or Username")/*displays error message*/
                }
            }
        </script>
    </body>
</html>
