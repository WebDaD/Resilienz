/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Users', ['$scope', 'resilienzManagerDataProvider', 'NgTableParams', function ($scope, resilienzManagerDataProvider, NgTableParams) {
      var self = this
      self.users = []
      self.tableParams = {}

      $scope.isLoading = true
      resilienzManagerDataProvider.users().query(function (users) {
        self.users = users
        self.tableParams = new NgTableParams({
          sorting: { order: 'asc' },
          count: 50,
          page: 1
        }, {
          dataset: self.users,
          filterDelay: 0
        })
        $scope.isLoading = false
      })

      $scope.$on('LastRepeaterElement', function () {
        $scope.isLoading = false
      })
    }])
}())
