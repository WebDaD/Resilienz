/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Editor', ['$scope', 'resilienzManagerDataProvider', '$uibModalInstance', 'data', function ($scope, resilienzManagerDataProvider, $uibModalInstance, data) {
      var self = this
      self.cancel = function () {
        $uibModalInstance.close()
      }
      self.close = function () {
        resilienzManagerDataProvider.imageRescale(data.image, self.coords).then(function (something) {
          $uibModalInstance.close()
        })
      }
      self.image = data.image
      self.imageToLoad = 'bookimages/' + self.image
      self.options = {
        handles: true,
        hide: false,
        movable: true,
        resizable: false,
        show: true,
        minHeight: data.height,
        maxHeight: data.height,
        minWidth: data.width,
        maxWidth: data.width
      }
      // http://odyniec.net/projects/imgareaselect/
      // https://github.com/eliyahen/ng-imgAreaSelect
    }])
}())
