"use strict";

var app = angular.module("Kaboom", ['ngRoute', 'ui.bootstrap', 'kaboom.services', 'kaboom.controllers']);

app.config(function($routeProvider){
    $routeProvider.when("/",{
        templateUrl : "partials/home.html",
        controller: "MainCtrl",
        title: "Home"
    });
    $routeProvider.when("/balance",{
        templateUrl : "partials/balance.html",
        controller: "MainCtrl",
        title: "Balance"
    });
    $routeProvider.when("/transaction",{
        templateUrl : "partials/transaction.html",
        controller: "MainCtrl",
        title: "Transaction"
    });
    $routeProvider.when("/history",{
        templateUrl : "partials/history.html",
        controller: "MainCtrl",
        title: "History"
    });

    $routeProvider.otherwise({redirectTo : "/"});
});

app.run(['$location','$rootScope', function($location, $rootscope){
    $rootscope.$on('$routeChangeSuccess', function(event, currentRoute, previousRoute){
        $rootscope.title = currentRoute.title;
    });
}]);