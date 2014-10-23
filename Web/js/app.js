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
                if(userInfo.hasOwnProperty("id")){
                    return $q.when(userInfo);
                } else{
                    return $q.reject({authenticated : false});
                }
            }]
        }
    });
    $routeProvider.when("/balance",{
        templateUrl : "html/partials/balance.html",
        controller: "MainCtrl",
        title: "Balance",
        resolve : {
            auth : ['$q', 'LoginFactory', function($q, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo.hasOwnProperty("id")){
                    return $q.when(userInfo);
                } else{
                    return $q.reject({authenticated : false});
                }
            }]
        }
    });
    $routeProvider.when("/transaction",{
        templateUrl : "html/partials/transaction.html",
        controller: "MainCtrl",
        title: "Transaction",
        resolve : {
            auth : ['$q', 'LoginFactory', function($q, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo.hasOwnProperty("id")){
                    return $q.when(userInfo);
                } else{
                    return $q.reject({authenticated : false});
                }
            }]
        }
    });
    $routeProvider.when("/history",{
        templateUrl : "html/partials/history.html",
        controller: "MainCtrl",
        title: "History",
        resolve : {
            auth : ['$q', 'LoginFactory', function($q, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo.hasOwnProperty("id")){
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
        title : "Login"
    });
    $routeProvider.when("/signup", {
        templateUrl : "html/sign-up.html",
        controller : "SignupCtrl",
        title : "Sign Up"
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