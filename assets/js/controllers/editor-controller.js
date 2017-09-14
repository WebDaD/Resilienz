/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Editor', ['$scope', 'resilienzManagerDataProvider', '$uibModalInstance', 'data', function ($scope, resilienzManagerDataProvider, $uibModalInstance, data) {
      var self = this
      self.orgWidth = document.getElementById('imgAreaSelect').naturalWidth
      self.orgHeight = document.getElementById('imgAreaSelect').naturalHeight
      self.cancel = function () {
        angular.element('#imgAreaSelect').imgAreaSelect({
          disable: true,
          hide: true,
          remove: true
        })
        $uibModalInstance.dismiss('cancel')
      }
      self.close = function () {
        // TODO: get image width, height
        var clientWidth = document.getElementById('imgAreaSelect').clientWidth
        var clientHeight = document.getElementById('imgAreaSelect').clientHeight
        resilienzManagerDataProvider.imageRescale(data.image, self.coords, clientWidth, clientHeight, self.orgWidth, self.orgHeight).then(function (something) {
          angular.element('#imgAreaSelect').imgAreaSelect({
            disable: true,
            hide: true,
            remove: true
          })
          $uibModalInstance.close(data.image)
        })
      }
      self.image = data.image
      self.imageToLoad = 'bookimages/' + self.image
      self.options = {
        enable: true,
        handles: true,
        hide: false,
        movable: true,
        resizable: true,
        show: true,
        aspectRatio: data.width + ':' + data.height,
        imageHeight: self.orgHeight,
        imageWidth: self.orgWidth,
        x1: 1,
        y1: 1,
        x2: 1 + data.width,
        y2: 1 + data.height
      }
      // http://odyniec.net/projects/imgareaselect/
      // https://github.com/eliyahen/ng-imgAreaSelect
    }])
}())
