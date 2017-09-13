/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Instructions', ['$uibModalInstance', function ($uibModalInstance) {
      this.close = function () {
        $uibModalInstance.dismiss('cancel')
      }
    }])
}())
