"use strict";

/* Services */

var services = angular.module('kaching.services', []);

services.factory('LoginFactory', ['$http', '$location','$q', '$window', function($http, $location, $q, $window){
    var userInfo = {};

    function init(){
        if($window.sessionStorage['userInfo']){
            setUserInfo(JSON.parse($window.sessionStorage['userInfo']));
        }  
    }
    init();

    function getUserInfo(){
        return userInfo;
    }

    function setUserInfo(info){
        userInfo = info;
    }

    function login(username, password){
        var deferred = $q.defer();

        $http.get("https://kaching.xyz/api/LoginServlet?username=" +
            encodeURIComponent(username) + "&password=" + 
            encodeURIComponent(password), {cache : true}
        ).success(function(data, status, headers, config){
            userInfo = {
                user_id: data['id'],
                username: data['username']
            };
            $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            deferred.resolve(userInfo);
        }).error(function(data, status, headers, config){
            deferred.reject(data);
        });
        return deferred.promise;
    }

    function signup(username, password){
        var deferred = $q.defer();

        $http.post("https://kaching.xyz/api/LoginServlet", {
            username: username,
            password: password
        }, {cache : true}
        ).success(function(data, status, headers, config){
            userInfo = {
                user_id: data['id'],
                username: data['username']
            };
            $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            deferred.resolve(userInfo);
        }).error(function(data, status, headers, config){
            deferred.reject(data);
        });
        return deferred.promise;
    }

    return {
        getUserInfo: getUserInfo,
        setUserInfo: setUserInfo,
        login: login,
        signup: signup
    }
}]);

services.factory('AccountFactory', ['$http', '$q', function($http, $q){
    return {
        listAll : function(user_id){
            var deferred = $q.defer();
            $http.get("https://kaching.xyz/api/AccountServlet?id=" +
                encodeURIComponent(user_id)
            ).success(function(data, status, headers, config){
                deferred.resolve(data);
            }).error(function(data, status, headers, config){
                deferred.reject(data);
            });
            return deferred.promise;
        },
        createAccount : function(newAccount){
            var deferred = $q.defer();
            $http.post("https://kaching.xyz/api/AccountServlet", 
                newAccount
            ).success(function(data, status, headers, config){
                deferred.resolve(data);
            }).error(function(data, status, headers, config){
                deferred.reject(data);
            });
            return deferred.promise;
        },
        updateAccount : function(updatedAccount){
            var deferred = $q.defer();
            $http.put("https://kaching.xyz/api/AccountServlet", 
                updatedAccount
            ).success(function(data, status, headers, config){
                deferred.resolve(data);
            }).error(function(data, status, headers, config){
                deferred.reject(data);
            });
            return deferred.promise;

        },
        deleteAccount : function(account_number){
            var deferred = $q.defer();
            $http.delete("https://kaching.xyz/api/AccountServlet?number=" +
                encodeURIComponent(account_number)
            ).success(function(data, status, headers, config){
                deferred.resolve(data);
            }).error(function(data, status, headers, config){
                deferred.reject(data);
            });
            return deferred.promise;

        }
    }
}]);

services.factory('AccountsFactory', ['$http', '$q', function($http, $q){
    return {
        listAll : function(user_id){
            var deferred = $q.defer();
            $http.get("https://kaching.xyz/api/AccountServlet?id=" +
                encodeURIComponent(user_id), {cache : true}
            ).success(function(data, status, headers, config){
                deferred.resolve(data);
            }).error(function(data, status, headers, config){
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
}]);

services.factory('HistoryFactory', ['$http', '$q', function($http, $q){
    return {
        listAll : function(account_number){
            var deferred = $q.defer();
            $http.get("https://kaching.xyz/api/HistoryServlet?number=" +
                encodeURIComponent(account_number), {cache : true}
            ).success(function(data, status, headers, config){
                deferred.resolve(data);
            }).error(function(data, status, headers, config){
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
}]);

services.factory('TransactionFactory', ['$http', '$q', function($http, $q){
    return {
        sendTransaction : function(transaction){
            var deferred = $q.defer();
            $http.post("https://kaching.xyz/api/TransactionServlet", 
                transaction
            ).success(function(data, status, headers, config){
                deferred.resolve(data);
            }).error(function(data, status, headers, config){
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
}]);
