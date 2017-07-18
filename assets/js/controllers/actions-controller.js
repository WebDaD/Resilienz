/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Actions', ['$scope', 'resilienzManagerDataProvider', 'NgTableParams', function ($scope, resilienzManagerDataProvider, NgTableParams) {
      var self = this
      self.actions = []
      self.tableParams = {}

      $scope.isLoading = true
      resilienzManagerDataProvider.actions().success(function (actions) {
        self.actions = actions.data
        self.tableParams = new NgTableParams({
          sorting: { order: 'asc' },
          count: 50,
          page: 1
        }, {
          dataset: self.actions,
          filterDelay: 0
        })
        $scope.isLoading = false
      })

      $scope.$on('LastRepeaterElement', function () {
        $scope.isLoading = false
      })
    }])
}())
