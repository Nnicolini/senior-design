"use strict";

/* Services */

var services = angular.module('kaboom.services', []);

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

    function loginGET(username, password){
        var deferred = $q.defer();

        $http.get("https://128.4.26.194:8443/LoginServlet?username=" +
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

    //For some reason, the tomcat7 server is disabling CORS from POST requests (i.e. this doesn't work)
    function loginPOST(username, password){
        var deferred = $q.defer();

        $http.post("https://128.4.26.194:8443/LoginServlet", {
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
        login: loginGET,
        loginGET: loginGET,
        loginPOST: loginPOST
    }
}]);


services.factory('SignupFactory', ['$http', '$q', '$window', function($http, $q, $window){
    return {
        signup : function(username, password){
            var deferred = $q.defer();
            $http.get("https://128.4.26.194:8443/SignupServlet?username=" +
                encodeURIComponent(username) + "&password=" + 
                encodeURIComponent(password), {cache : true}
            ).success(function(data, status, headers, config){
                var userInfo = {
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
    }
}]);

services.factory('AccountFactory', ['$http', '$q', function($http, $q){
    return {
        listAll : function(user_id){
            var deferred = $q.defer();
            $http.get("https://128.4.26.194:8443/AccountServlet?id=" +
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
            $http.post("https://128.4.26.194:8443/AccountServlet", 
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
            $http.put("https://128.4.26.194:8443/AccountServlet", 
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
            $http.delete("https://128.4.26.194:8443/AccountServlet?number=" +
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
            $http.get("https://128.4.26.194:8443/AccountServlet?id=" +
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
            $http.get("https://128.4.26.194:8443/HistoryServlet?number=" +
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
