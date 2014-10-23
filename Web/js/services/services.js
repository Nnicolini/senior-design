"use strict";

/* Services */

var services = angular.module('kaboom.services', []);

services.factory('LoginFactory', ['$http', '$q', '$window', function($http, $q, $window){
    var userInfo;

    function init(){
        if($window.sessionStorage['userInfo'])
            userInfo = JSON.parse($window.sessionStorage['userInfo']);
        else
            userInfo = {};
    }
    init();

    function getUserInfo(){
        return userInfo;
    }

    function loginGET(username, password){
        var deferred = $q.defer();

        $http.get("http://128.4.26.235:8080/LoginServlet?username=" +
            encodeURIComponent(username) + "&password=" + 
            encodeURIComponent(password), {cache : true}
        ).success(function(data, status, headers, config){
            console.log(data);
            userInfo = {
                id: data['id'],
                username: data['username']
            };
            $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            deferred.resolve(userInfo);
        }).error(function(data, status, headers, config){
            console.log(data);
            deferred.reject(data);
        });

        return deferred.promise;
    }

    //For some reason, the tomcat7 server is disabling CORS from POST requests (i.e. this doesn't work)
    function loginPOST(username, password){
        var deferred = $q.defer();

        $http.post("http://128.4.26.235:8080/LoginServlet", {
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
        login: loginGET,
        loginPOST: loginPOST,
        loginGET: loginGET
    }
}]);


services.factory('SignupFactory', ['$http', '$q', '$window', function($http, $q, $window){
    return {
        signup : function(username, password){
            console.log("Signing up " + username + ", " + password);
        }
    }
}]);
