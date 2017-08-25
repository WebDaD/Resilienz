/* global angular */
angular.module('ng-fitty', [])
.directive('ngFitty', function () {
  return {
    restrict: 'A',
    scope: {
      ngFittyDetails: '='
    },
    link: function postLink (scope, element, attrs) {
      if (element[0].tagName === 'P') {
        if (scope.ngFittyDetails === undefined) {
          scope.ngFittyDetails = {}
        }
        var fitty = fitty(angular.element(element))

        scope.$watch('fit', function (detail) {
          scope.ngFittyDetails = detail
        }, true)
      } else {
        console.log('ng-fitty attribute can only be used on p elements.')
      }
    }
  }
})
