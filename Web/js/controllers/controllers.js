"use strict";

/* Controllers */

var app = angular.module('kaboom.controllers', []);

app.controller('MainCtrl', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location){
	
	function isUndefinedOrNull(val){
		return (angular.isUndefined(val) || val === null);
	}

	$scope.titleCheck = function(){
		return isUndefinedOrNull($rootScope.title) || $rootScope.title == 'Login' || $rootScope.title == 'Sign Up';
	}

	$scope.logout = function(){
		$scope.userInfo = null;
		$location.path("/");
	}

}]);

app.controller('LoginCtrl', ['$scope', '$location', '$window', 'LoginFactory', function($scope, $location, $window, LoginFactory){
	$scope.userInfo = null;

	$scope.login = function(){
		LoginFactory.login($scope.user.username, $scope.user.password)
			.then(function (result){
				$scope.userInfo = result;
				$location.path("/");
			}, function (error){
				$window.alert("Invalid credentials");
				console.log(error);
			});
	};

}]);

app.controller('SignupCtrl', ['$scope', '$location', '$window', 'SignupFactory', function($scope, $location, $window, SignupFactory){

	$scope.signup = function(){
		if($scope.user.password !== $scope.user.password2){
			$window.alert("Passwords don't match");
		}
		else{
			SignupFactory.signup($scope.user.username, $scope.user.password)
		}
	}

}]);
