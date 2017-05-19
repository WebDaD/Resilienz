/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Editor', ['$scope', 'resilienzManagerDataProvider', '$uibModalInstance', 'data', function ($scope, resilienzManagerDataProvider, $uibModalInstance, data) {
      var self = this
      self.cancel = function () {
        $uibModalInstance.close()
      }
      self.close = function () {
        // TODO: send data to backend for image cropping
        $uibModalInstance.close()
      }
      self.image = data.image
      self.options = {
        handles: true,
        movable: true,
        resizable: false,
        minHeight: data.height,
        maxHeight: data.height,
        minWidth: data.width,
        maxWidth: data.width
      }
      // http://odyniec.net/projects/imgareaselect/
      // https://github.com/eliyahen/ng-imgAreaSelect
    }])
}())
