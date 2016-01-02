'use strict';

/* Directives */


angular.module('myApp.directives', [])
    
.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

.directive("alertCustom", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/alerts.html',
        replace: true,
        //isolate the fuckin scope!
        scope: {
            alertObject: "="
        }
    }
});