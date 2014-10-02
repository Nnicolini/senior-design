"use strict";

var app = angular.module("Kaboom", ['ngRoute', 'ui.bootstrap', 'mr.services', 'mr.controllers']);

app.config(function($routeProvider){
    $routeProvider.when("/",{
        templateUrl : "html/partials/main.html",
        controller: "MainCtrl",
        title: "Main"
    });

    $routeProvider.otherwise({redirectTo : "/"});
});

app.run(['$location','$rootScope','$http', function($location, $rootscope, $http){
    $rootscope.$on('$routeChangeSuccess', function(event, current, next){
        $rootscope.title = current.$$route.title;
    });
}]);