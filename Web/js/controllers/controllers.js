"use strict";

/* Controllers */

var app = angular.module('kaboom.controllers', []);

app.controller('MainCtrl', ['$rootScope', '$scope',  function($rootScope, $scope){
	
	$scope.titleCheck = function(){
		var title = $rootScope.title;
		return angular.isUndefined(title) || title === null || title == 'Login' || title == 'Sign Up';
	}

}]);

app.controller('LogoutCtrl', ['$location', '$scope', '$window', 'LoginFactory', function($location, $scope, $window, LoginFactory){

	$scope.userInfo = LoginFactory.getUserInfo();

	$scope.logout = function(){
		$window.sessionStorage["userInfo"] = null;
		LoginFactory.setUserInfo({});
		$location.path("/Not/A/Real/URL");
	}

}]);

app.controller('LoginCtrl', ['$location','$scope', '$window', 'LoginFactory', function($location, $scope, $window, LoginFactory){
	
	$scope.login = function(){
		LoginFactory.login($scope.user.username, $scope.user.password)
			.then(function (result){
				$location.path("/");
				$scope.userInfo = result;
			}, function (error){
				$window.alert("Invalid credentials");
			});
	};

}]);

app.controller('SignupCtrl', ['$location', '$scope', '$window', 'LoginFactory','SignupFactory', function($location, $scope, $window, LoginFactory, SignupFactory){

	$scope.signup = function(){
		if($scope.user.password != null && $scope.user.password2 != null){
			if($scope.user.password !== $scope.user.password2){
				$window.alert("Passwords don't match");
			}
			else{
				SignupFactory.signup($scope.user.username, $scope.user.password)
					.then(function (result){
						$scope.userInfo = {
			                id: result['id'],
			                username: result['username']
			            };
						$window.sessionStorage["userInfo"] = JSON.stringify($scope.userInfo);
						LoginFactory.setUserInfo($scope.userInfo);
						$location.path("/");
					}, function (error){
						$window.alert("That username is already taken");
					});
			}
		}
	}

	$scope.cancel = function(){
		$location.path("/login");
	}

}]);
