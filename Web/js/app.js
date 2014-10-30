"use strict";

var app = angular.module("Kaboom", ['ngRoute', 'ui.bootstrap', 'kaboom.services', 'kaboom.controllers']);

app.config(function($routeProvider){
    $routeProvider.when("/", {
        templateUrl : "html/partials/home.html",
        controller : "MainCtrl",
        title : "Home",
        resolve : {
            auth : ['$q', 'LoginFactory', function($q, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo != null && userInfo.hasOwnProperty("user_id")){
                    return $q.when(userInfo);
                } else{
                    return $q.reject({authenticated : false});
                }
            }]
        }
    });
    $routeProvider.when("/accounts",{
        templateUrl : "html/partials/accounts.html",
        controller: "AccountsCtrl",
        title: "Accounts",
        resolve : {
            auth : ['$q', 'LoginFactory', function($q, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo != null && userInfo.hasOwnProperty("user_id")){
                    return $q.when(userInfo);
                } else{
                    return $q.reject({authenticated : false});
                }
            }]
        }
    });
    $routeProvider.when("/transfer",{
        templateUrl : "html/partials/transfer.html",
        controller: "MainCtrl",
        title: "Transfer",
        resolve : {
            auth : ['$q', 'LoginFactory', function($q, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo != null && userInfo.hasOwnProperty("user_id")){
                    return $q.when(userInfo);
                } else{
                    return $q.reject({authenticated : false});
                }
            }]
        }
    });
    $routeProvider.when("/history/:id",{
        templateUrl : "html/partials/history.html",
        controller: "HistoryCtrl",
        title: "History",
        resolve : {
            auth : ['$q', 'LoginFactory', function($q, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo != null && userInfo.hasOwnProperty("user_id")){
                    return $q.when(userInfo);
                } else{
                    return $q.reject({authenticated : false});
                }
            }]
        }
    });
    $routeProvider.when("/login", {
        templateUrl : "html/login.html",
        controller : "LoginCtrl",
        title : "Login",
        resolve: {
            auth : ['$q', '$window', 'LoginFactory', function($q, $window, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo != null && userInfo.hasOwnProperty("user_id")){
                    $window.alert("You are already logged in");
                    return $q.reject({authenticated : false});
                } else{
                    return $q.when(userInfo);
                }
            }]
        }
    });
    $routeProvider.when("/signup", {
        templateUrl : "html/sign-up.html",
        controller : "SignupCtrl",
        title : "Sign Up",
        resolve: {
            auth : ['$q', '$window', 'LoginFactory', function($q, $window, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo != null && userInfo.hasOwnProperty("user_id")){
                    $window.alert("You are already signed up");
                    return $q.reject({authenticated : false});
                } else{
                    return $q.when(userInfo);
                }
            }]
        }
    });

    $routeProvider.otherwise({redirectTo : "/"});
});

app.run(['$location','$rootScope', function($location, $rootScope){
    $rootScope.$on('$routeChangeSuccess', function(event, currentRoute, previousRoute, userInfo){
        $rootScope.title = currentRoute.title;
    });

    $rootScope.$on('$routeChangeError', function(event, currentRoute, previousRoute, eventObj){
        if(eventObj.authenticated === false){
            $location.path('/login');
        }
    });
}]);
