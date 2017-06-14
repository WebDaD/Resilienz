/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Editor', ['$scope', 'resilienzManagerDataProvider', '$uibModalInstance', 'data', function ($scope, resilienzManagerDataProvider, $uibModalInstance, data) {
      var self = this
      self.cancel = function () {
        $uibModalInstance.close()
      }
      self.close = function () {
        resilienzManagerDataProvider.images().rescale({id: data.id}, self.coords, function (something) {
          $uibModalInstance.close()
        })
      }
      self.image = data.imagepath
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
