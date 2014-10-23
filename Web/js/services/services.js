"use strict";

/* Services */

var services = angular.module('kaboom.services', []);

services.factory('LoginFactory', ['$http', '$q', '$window', function($http, $q, $window){
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
        console.log(info);
        userInfo = info;
    }

    function loginGET(username, password){
        var deferred = $q.defer();

        $http.get("https://128.4.26.235:8443/LoginServlet?username=" +
            encodeURIComponent(username) + "&password=" + 
            encodeURIComponent(password), {cache : true}
        ).success(function(data, status, headers, config){
            userInfo = {
                id: data['id'],
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

        $http.post("https://128.4.26.235:8443/LoginServlet", {
            username: username,
            password: password
        }, {cache : true}
        ).success(function(data, status, headers, config){
            userInfo = {
                id: data['id'],
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
            $http.get("https://128.4.26.235:8443/SignupServlet?username=" +
                encodeURIComponent(username) + "&password=" + 
                encodeURIComponent(password), {cache : true}
            ).success(function(data, status, headers, config){
                var userInfo = {
                    id: data['id'],
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
