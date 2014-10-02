"use strict";

/* Controllers */

var app = angular.module('mr.controllers', []);

app.controller('MainCtrl', ['$scope', function( $scope){

    $scope.x = 0;
 
    $scope.add = function(a){
        $scope.x += a;
    }

}]);
