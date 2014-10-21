"use strict";

/* Controllers */

var app = angular.module('kaboom.controllers', []);

app.controller('MainCtrl', ['$scope', 'LoginFactory', function($scope, LoginFactory){
	$scope.user = {};
	$scope.user.loggedin = false;

    $scope.login = function(){
    	LoginFactory.authenticate($scope.user.username, $scope.user.password).then(function(result){
    		console.log(result);

	    	if(result['id']){
	    		$scope.user.loggedin = true;
	    	}
	    	else{
	    		$scope.user.loggedin = false;
	    	}
    	});

    }

}]);
