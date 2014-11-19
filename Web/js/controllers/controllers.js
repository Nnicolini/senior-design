"use strict";

/* Controllers */

var app = angular.module('kaboom.controllers', []);

app.controller('MainCtrl', ['$rootScope', '$scope', 
	function($rootScope, $scope){
		
		$scope.titleCheck = function(){
			var title = $rootScope.title;
			return angular.isUndefined(title) || title === null || title == 'Login' || title == 'Sign Up';
		}

	}
]);

app.controller('LogoutCtrl', ['$location', '$scope', '$window', 'LoginFactory', 
	function($location, $scope, $window, LoginFactory){

		$scope.userInfo = LoginFactory.getUserInfo();

		$scope.logout = function(){
			$window.sessionStorage["userInfo"] = null;
			LoginFactory.setUserInfo({});
			$location.path("/Not/A/Real/URL");
		}

	}
]);

app.controller('LoginCtrl', ['$location', '$scope', '$window', 'LoginFactory', 
	function($location, $scope, $window, LoginFactory){
		
		$scope.login = function(){
			LoginFactory.login($scope.user.username, $scope.user.password)
				.then(function (result){
					$location.path("/");
					$scope.userInfo = result;
				}, function (error){
					$window.alert("Invalid credentials");
				});
		};

	}
]);

app.controller('SignupCtrl', ['$location', '$scope', '$window', 'LoginFactory','SignupFactory', 
	function($location, $scope, $window, LoginFactory, SignupFactory){

		$scope.signup = function(){
			if($scope.user.password != null && $scope.user.password2 != null){
				if($scope.user.password !== $scope.user.password2){
					$window.alert("Passwords don't match");
				}
				else{
					SignupFactory.signup($scope.user.username, $scope.user.password)
						.then(function (result){
							$scope.userInfo = {
				                user_id: result['id'],
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

	}
]);

app.controller('AccountsCtrl', ['$location', '$scope', '$rootScope', '$window', 'AccountsFactory', 
	function($location, $scope, $rootScope, $window, AccountsFactory){

		AccountsFactory.listAll(JSON.parse($window.sessionStorage['userInfo']).user_id)
			.then(function (result){

				for(var i = 0; i < result.accounts.length; i++){
					//Force decimal values to show 2 decimal places 
					result.accounts[i].balance = "$" + Number(result.accounts[i].balance).toFixed(2);

					//Force interest rate to also show a % sign
					result.accounts[i].interest_rate += "%";
				}

				$scope.accounts = result.accounts;
			});

		$scope.viewHistory = function(account_number){
			$location.path("/history/" + account_number);
			$rootScope.historyNumber = account_number;
		}

	}
]);

app.controller('HistoryCtrl', ['$location', '$scope', '$rootScope', '$window', 'AccountsFactory', 'HistoryFactory',
	function($location, $scope, $rootScope, $window, AccountsFactory, HistoryFactory){
		
		/*
		 * Decided to add $rootScope to allow the passing of the account number from the Accounts page
		 * instead of parsing URL for account number (which could be a security issue similar to SQL injection)
		 * then having to do a check against the user_id's list of all accounts and the given number
		 */


		//Parses the URL path for the desired account number
		function getNumber(){
			return $location.path().split("/")[2];
		}

		$scope.history = [];

		HistoryFactory.listAll($rootScope.historyNumber)
			.then(function(result){

				for(var i = 0; i < result.history.length; i++){
					$scope.history.push(result.history[i]);

					//Set the color of the amount displayed
					//Force decimal values to show 2 decimal places
					if(Number(result.history[i].amount) > 0){
						$scope.history[i].display_color = "green";
						$scope.history[i].amount = "+$" + Number(result.history[i].amount).toFixed(2);
					}
					else if (Number(result.history[i].amount) < 0){
						$scope.history[i].display_color = "red";
						$scope.history[i].amount = "-$" + Number(result.history[i].amount).toFixed(2);
					} else{
						$scope.history[i].display_color = "white";
						$scope.history[i].amount = "$" + Number(result.history[i].amount).toFixed(2);
					}
				}

			});

		//Callback function for the "Go back" button to return to the Accounts page
		$scope.cancel = function(){
			$location.path("/accounts");
		}

	}
]);
