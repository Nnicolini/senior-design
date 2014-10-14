"use strict";

/* Controllers */

var app = angular.module('kaboom.controllers', []);

app.controller('MainCtrl', ['$scope', 'LoginFactory', function( $scope){
	$scope.user = {};
	$scope.user.loggedin = false;

    $scope.login = function(){
    	console.log("Username = " + $scope.user.username);
    	console.log("Password = " + $scope.user.password);
    	$scope.user.loggedin = true;
    }

}]);
