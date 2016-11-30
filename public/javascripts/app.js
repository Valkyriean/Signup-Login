var app = angular.module('MainCtrl', ['ui.router']);
app.config(function($stateProvider,$urlRouterProvider) {

    var login = {
        name: 'login',
        url: '/login',
        controller: 'Ctrl',
        templateUrl: 'template/Login.html'
    };

    var signup = {
        name: 'signup',
        url: '/signup',
        controller: 'Ctrl',
        templateUrl: 'template/SignUp.html'
    };

    $stateProvider.state(login);
    $stateProvider.state(signup);

    $urlRouterProvider.otherwise('/login');

});


var Loginurl = "http://localhost:3000/api/login";
var SignUPurl = "http://localhost:3000/api/signup";

function isEmail(str){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}

function goodPassword(str){
    var reg =/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/;
    return reg.test(str);
}

function goodName(str){
    var reg =/^[A-Za-z]{1,}$/;
    return reg.test(str);
}

var token;
var init = function() {
    $("#signbutton").click(function(e){
        e.preventDefault();
        $state.go("signup");
    });


    $("#Button").click(function(e) {
        e.preventDefault();
        var text = document.getElementById("EnterText").value;
        var password = document.getElementById("EnterPassword").value;
        var data = {username:text,password:password};
        $.post(Loginurl,data,function (response) {
            console.log(response);
            if(response.status=='success'){
                alert('Welcome back '+response.lastname);
                token = response.token;
                console.log(token);
                //TODO save token as cookies

                //TODO forward to home page(not needed yet)
            }else{
                alert('login '+response.status);
            }
        },'json');
    });


    $("#submit").click(function(e) {
        e.preventDefault();
        var email = $("#emailInput").val();
        var firstname = $("#firstnameInput").val();
        var lastname = $("#lastnameInput").val();
        var password = $("#passwordInput").val();
        var verifypassword = $("#verifypasswordInput").val();

        if(!isEmail(email)) {
            //wrong email
            alert('Invalid Email Address');
            $("#email").css("color","red");
        }else {
            $("#email").css("color","black");
        }

        if(!goodName(firstname)){
            //not good first name
            alert('Invalid First Name');
            $("#firstName").css("color","red");
        }else{
            $("#firstName").css("color","black");
        }

        if(!goodName(lastname)){
            //not good last name
            alert('Invalid Last Name');
            $("#lastName").css("color","red");
        }else{
            $("#lastName").css("color","black");
        }

        if(!goodPassword(password)){
            //not good password
            alert('Invalid Password');
            $("#password").css("color","red");
        }else {
            $("#password").css("color","black");
        }

        if(password!=verifypassword){
            alert('Two Password Are Not Same');
            $("#verifyPassword").css("color","red");
        }else {
            $("#verifyPassword").css("color","black");
        }

        if( isEmail(email) && goodPassword(password) && (password == verifypassword) && goodName(firstname) && goodName(lastname) ) {
            //If user input is all good
            var data = {email:email,firstname:firstname,lastname:lastname,password:password,verifypassword:verifypassword};
            $.post(SignUPurl,data,function (response) {
                console.log(response);
                var res = response.status;
                if(res == 'we'){
                    alert('Invalid Email Address');
                }else if(res == 'wp'){
                    alert('Invalid Password');
                }else if(res == 'dp'){
                    alert('Two Password Are Not Same');
                }else if(res == 'wf'){
                    alert('Invalid First Name');
                }else if(res == 'wl'){
                    alert('Invalid Last Name');
                }else if(res == 'repeat'){
                    alert('The email address has already been registered ')
                }else if(res == 'success'){
                    alert('Sign In Success');
                    //TODO Jump to login page code here
                    $state.go("login");
                }else{
                    alert('There are some issue with server \nPlease contact with website administrator\n phantomgale@hotmail.com');
                }
            },'json');
        }
    });
};



$(document).ready(init);