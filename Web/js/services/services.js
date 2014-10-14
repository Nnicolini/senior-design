"use strict";

/* Services */

var services = angular.module('kaboom.services', []);

//Used to query for a list of browsers used in the interval number of days from a certain referer
services.factory('LoginFactory', ['$http', '$q', function($http, $q){
    return { 
        authenticate : function(username, password){
            var deferred = $q.defer();
            $http.get("backend authentication API call", {cache : true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
}]);
