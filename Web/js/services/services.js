"use strict";

/* Services */

var services = angular.module('mr.services', []);

//Used to query for a list of browsers used in the interval number of days from a certain referer
services.factory('BrowsersFactory', ['$http', '$q', function($http, $q){
    return { 
        query : function(method, days, referer){
            var deferred = $q.defer();
            $http.get("/php/getBrowsers.php?method=" + method + "&days=" + days + "&referer=" + referer, {cache : true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        queryForAll : function(){
            var deferred = $q.defer();
            $http.get("/php/getBrowsers.php", {cache: true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
}]);

//Used to query for a list of available methods (metrics)
services.factory('MethodsFactory', ['$http', '$q', function($http, $q){
    return { 
        query : function(days, referer){
            var deferred = $q.defer();
            $http.get("/php/getMethods.php?days=" + days + "&referer=" + referer, {cache: true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        queryForAll : function(){
            var deferred = $q.defer();
            $http.get("/php/getMethods.php", {cache: true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        queryForCritical : function(){
            var deferred = $q.defer();
            $http.get("/php/getCriticalMethods.php", {cache: true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
}]);

//Used to query for a list of referers 
services.factory('ReferersFactory', ['$http', '$q', function($http, $q){
    return { 
        query : function(days){
            var deferred = $q.defer();
            $http.get("/php/getReferers.php?days=" + days, {cache: true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        queryForAll : function(){
            var deferred = $q.defer();
            $http.get("/php/getReferers.php", {cache: true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
}]);

//Used to query for a list of date/browser/average times from the interval number days for a specific method/referer
services.factory('TimesFactory', ['$http', '$q', function($http, $q){
    return {
        query : function(method, days, referer){
            var deferred = $q.defer();
            $http.get("/php/getTimes.php?method=" + method + "&days=" + days + "&referer=" + referer + "&byBrowser=false", {cache : true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        queryForByBrowser : function(method, days, referer){
            var deferred = $q.defer();
            $http.get("/php/getTimes.php?method=" + method + "&days=" + days + "&referer=" + referer + "&byBrowser=true", {cache : true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
}]);

//Used to test the DB connection
services.factory('ConnectionFactory', ['$http', '$q', function($http, $q){
    return { test : function(){
        var deferred = $q.defer();
        $http.get("php/connection.php", {cache : true}).success(function(data){
            deferred.resolve(data);
        });
        return deferred.promise;
    }};
}]);

//Used to query for dash data
services.factory('DashFactory', ['$http', '$q', function($http, $q){
    return { query : function(days){
        var deferred = $q.defer();
        $http.get("/php/getDashMetrics.php?days=" + days, {cache : true}).success(function(data){
            deferred.resolve(data);
        });
        return deferred.promise;
    }};
}]);

//Used to delete todays metrics from a certain referer
services.factory('DeleteFactory', ['$http', '$q', function($http, $q){
    return { deleteToday : function(referer){
        var deferred = $q.defer();
        $http.get("/php/deleteToday.php?referer=" + referer).success(function(data){
            deferred.resolve(data);
        });
        return deferred.promise;
    }};
}]);

//Used to get fire tablet metrics
services.factory('FireFactory', ['$http', '$q', function($http, $q){
    return { 
        getListOfBranches : function(){
            var deferred = $q.defer();
            $http.get("/php/getFireMetrics.php?listOf=branch").success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getListOfDates : function(){
            var deferred = $q.defer();
            $http.get("/php/getFireMetrics.php?listOf=date").success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getListOfBuildNumbers : function(){
            var deferred = $q.defer();
            $http.get("/php/getFireMetrics.php?listOf=buildNum").success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getListOfApkNumbers : function(){
            var deferred = $q.defer();
            $http.get("/php/getFireMetrics.php?listOf=apkNum").success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getListOfDevices : function(){
            var deferred = $q.defer();
            $http.get("/php/getFireMetrics.php?listOf=device").success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getListOfMethods : function(){
            var deferred = $q.defer();
            $http.get("/php/getFireMetrics.php?listOf=method").success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getLists : function(){
            var deferred = $q.defer();
            $http.get("/php/getFireMetrics.php?listOf=all", {cache : true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        query : function(){
            var deferred = $q.defer();
            $http.get("/php/getFireMetrics.php", {cache : true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
}]);
