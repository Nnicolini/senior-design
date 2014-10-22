"use strict";

/* Services */

var services = angular.module('kaboom.services', []);

//Used to query for a list of browsers used in the interval number of days from a certain referer
services.factory('LoginFactory', ['$http', '$q', function($http, $q){
    return { 
        authenticate : function(username, password){
            var deferred = $q.defer();
            $http.get("http://128.4.26.235:8080/MyServlet?username=" +
     			encodeURIComponent(username) + "&password=" + 
     			encodeURIComponent(password), {cache : true}).success(function(data)
     		{
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        register : function(){
            $http.post();
        }
    };
}]);
