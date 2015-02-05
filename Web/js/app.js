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
        controller: "TransferCtrl",
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

    $routeProvider.when("/test", {
        templateUrl : "html/partials/test.html",
        controller : "TestCtrl",
        title : "Test",
        resolve : {
            auth : ['$q', 'LoginFactory', function($q, LoginFactory){
                var userInfo = LoginFactory.getUserInfo();
                if(userInfo != null && userInfo.hasOwnProperty("user_id")){
                    return $q.when(userInfo);
                } else {
                    return $q.reject({authenticated : false});
                }
            }]
        }
    });

    $routeProvider.otherwise({redirectTo : "/"});
});

app.config(function($httpProvider){
    //From: http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/

    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
     
    /**
    * The workhorse; converts an object to x-www-form-urlencoded serialization.
    * @param {Object} obj
    * @return {String}
    */ 
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
          
        for(name in obj) {
            value = obj[name];
            
        if(value instanceof Array) {
            for(i=0; i<value.length; ++i) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        }
        else if(value instanceof Object) {
            for(subName in value) {
                subValue = value[subName];
                fullSubName = name + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
         }
        else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
          
        return query.length ? query.substr(0, query.length - 1) : query;
    };
     
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

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

