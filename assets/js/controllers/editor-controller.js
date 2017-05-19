/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Editor', ['$scope', 'resilienzManagerDataProvider', '$uibModalInstance', 'data', function ($scope, resilienzManagerDataProvider, $uibModalInstance, data) {
      var self = this
      self.close = function () {
        $uibModalInstance.close()
      }
      self.image = data.image
      // TODO: http://odyniec.net/projects/imgareaselect/
      // TODO: https://github.com/eliyahen/ng-imgAreaSelect
    }])
}())
