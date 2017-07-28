/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Editor', ['$scope', 'resilienzManagerDataProvider', '$uibModalInstance', 'data', function ($scope, resilienzManagerDataProvider, $uibModalInstance, data) {
      var self = this
      self.cancel = function () {
        $uibModalInstance.dismiss('cancel')
      }
      self.close = function () {
        resilienzManagerDataProvider.imageRescale(data.image, self.coords).then(function (something) {
          angular.element('#imgAreaSelect').imgAreaSelect({
            disable: true,
            hide: true,
            remove: true
          })
          $uibModalInstance.close()
        })
      }
      self.image = data.image
      self.imageToLoad = 'bookimages/' + self.image
      self.options = {
        enable: true,
        handles: true,
        hide: false,
        movable: true,
        resizable: false,
        show: true,
        minHeight: data.height,
        maxHeight: data.height,
        minWidth: data.width,
        maxWidth: data.width,
        x1: 1,
        y1: 1
      }
      // http://odyniec.net/projects/imgareaselect/
      // https://github.com/eliyahen/ng-imgAreaSelect
    }])
}())
