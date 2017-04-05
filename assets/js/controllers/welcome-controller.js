/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Welcome', ['$scope', 'resilienzManagerDataProvider', '$location', function ($scope, resilienzManagerDataProvider, $location) {
      var self = this
      self.toLayouter = function () {
        $location.path('/layout')
      }
    }])
}())
