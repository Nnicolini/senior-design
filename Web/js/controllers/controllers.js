"use strict";

/* Controllers */

var app = angular.module('kaching.controllers', []);

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

app.controller('SignupCtrl', ['$location', '$scope', '$window', 'LoginFactory',
	function($location, $scope, $window, LoginFactory){

		$scope.signup = function(){
			if($scope.user.password != null && $scope.user.password2 != null){
				if($scope.user.password !== $scope.user.password2){
					$window.alert("Passwords don't match");
				}
				else{
					LoginFactory.signup($scope.user.username, $scope.user.password)
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

				for(var i = 0; i < result.cash_accounts.length; i++){
					//Force decimal values to show 2 decimal places
					result.cash_accounts[i].balance = "$" + Number(result.cash_accounts[i].balance).toFixed(2);

					//Force interest rate to also show a % sign
					result.cash_accounts[i].interest_rate += "%";
				}
				$scope.cash_accounts = result.cash_accounts;

				for(var i = 0; i < result.credit_accounts.length; i++){
					//Force decimal values to show 2 decimal places
					result.credit_accounts[i].balance = "$" + Number(result.credit_accounts[i].balance).toFixed(2);
					result.credit_accounts[i].limit = "$" + Number(result.credit_accounts[i].limit).toFixed(2);
				}
				$scope.credit_accounts = result.credit_accounts;
			});

		$scope.viewHistory = function(account_number){
			$location.path("/history/" + account_number);
			$rootScope.historyNumber = account_number;
		}

	}
]);

app.controller('HistoryCtrl', ['$location', '$scope', '$rootScope', '$window', 'AccountsFactory', 'HistoryFactory', 'TransactionFactory',
	function($location, $scope, $rootScope, $window, AccountsFactory, HistoryFactory, TransactionFactory){

		$scope.dayRange = 90;
		$scope.historyOption = 'Last 90 Days';
		$scope.historyOptions = [
			'Last 30 Days',
			'Last 60 Days',
			'Last 90 Days',
			'Last 6 Months',
			'Last 12 Months',
			'Last 18 Months'
		];
		$scope.transactionType = 'All';
		$scope.transactionTypes = ['All'];
		TransactionFactory.getTransactionTypes().then(function(result){
			  for(var i = 0; i < result.types.length; i++){
					$scope.transactionTypes.push(result.types[i]);
				}

		});

		$scope.history = [];	//display copy
		var history = [];	//actual copy
		getHistory($rootScope.historyNumber, $scope.dayRange);

	  function getHistory(accountNumber, dayRange){
				HistoryFactory.listInDayRange(accountNumber, dayRange)
					.then(function(result){

						$scope.history = [];
						for(var i = 0; i < result.history.length; i++){
							$scope.history.push(result.history[i]);

							//Set the color of the amount displayed
							//Force decimal values to show 2 decimal places
							if(result.history[i].transaction_type == "History"){
								$scope.history[i].amount = Number(result.history[i].amount) + " days";
							}
							else if(Number(result.history[i].amount) > 0){
								$scope.history[i].display_color = "green";
								$scope.history[i].amount = "+$" + Number(result.history[i].amount).toFixed(2);
							}
							else if (Number(result.history[i].amount) < 0){
								$scope.history[i].display_color = "red";
								$scope.history[i].amount = "-$" + Number(-result.history[i].amount).toFixed(2);
							} else{
								$scope.history[i].display_color = "white";
								$scope.history[i].amount = "$" + Number(result.history[i].amount).toFixed(2);
							}
						}
						history = $scope.history;

				});
		}

		$scope.filterType = function(type){
			$scope.transactionType = type;
			$scope.history = history;
			if(type != "All"){
				  var newHistory = [];
				  for(var i = 0; i < $scope.history.length; i++){
						  if($scope.history[i].transaction_type == type){
								  newHistory.push($scope.history[i]);
							}
					}
					$scope.history = newHistory;
			}
		}

		$scope.setDayRange = function(historyOption){
				$scope.historyOption = historyOption;
				var stringArray = historyOption.split(" ");
				var dayRange = parseInt(stringArray[1]);
				if(stringArray[2] == "Months")
				    dayRange = dayRange * 30;
				$scope.dayRange = dayRange;
				console.log(dayRange);
				getHistory($rootScope.historyNumber, $scope.dayRange);
		}

		//Callback function for the "Go back" button to return to the Accounts page
		$scope.cancel = function(){
			$location.path("/accounts");
		}

	}
]);

app.controller('TestCtrl', ['$location', '$scope', '$rootScope', '$window', 'TransactionFactory',
	function($location, $scope, $rootScope, $window, TransactionFactory){

		$scope.transaction_type_options = ['Balance', 'Withdraw', 'Deposit', 'History'];
		$scope.transaction = {"type": $scope.transaction_type_options[0], "info": {}};
		$scope.result = {};

		$scope.sendTransaction = function(){
			console.log($scope.transaction)
      TransactionFactory.sendTransaction(JSON.stringify($scope.transaction))
      	.then(function (result){

      	$scope.result = result;
      });
		}


	}
]);

app.controller('TransferCtrl', ['$location', '$scope', '$rootScope', '$window', 'AccountFactory',
	function($location, $scope, $rootScope, $window, AccountFactory){

		$scope.accountsList = [];

		AccountFactory.listAll(JSON.parse($window.sessionStorage['userInfo']).user_id)
			.then(function (result){

				for(var i = 0; i < result.cash_accounts.length; i++){
					//Force decimal values to show 2 decimal places
					result.cash_accounts[i].balance = Number(result.cash_accounts[i].balance).toFixed(2);

					$scope.accountsList.push(result.cash_accounts[i].name + " XXXXXX"
						+ result.cash_accounts[i].number.substring(6, 11) + " (Avail. balance = $"
						+ result.cash_accounts[i].balance + ")");
				}

				$scope.accounts = result.cash_accounts;

			});

		$scope.fromAccount = "Select Any";
		$scope.toAccount = "Select Any";

		$scope.setFromAccount = function(fromAccount){
			$scope.fromAccount = fromAccount;
		}

		$scope.setToAccount = function(toAccount){
			$scope.toAccount = toAccount;
		}

		$scope.transfer = function(){
			var fromIndex = $scope.accountsList.indexOf($scope.fromAccount);
			var toIndex = $scope.accountsList.indexOf($scope.toAccount);

			var transferAmount = parseInt($scope.transferAmount);
			$scope.accounts[fromIndex].balance = parseFloat($scope.accounts[fromIndex].balance) - transferAmount;
			$scope.accounts[toIndex].balance = parseFloat($scope.accounts[toIndex].balance) + transferAmount;

            AccountFactory.updateAccount($scope.accounts[fromIndex]);
            AccountFactory.updateAccount($scope.accounts[toIndex]);
		}
	}
]);
