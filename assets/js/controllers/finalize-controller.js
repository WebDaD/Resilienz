/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Finalize', ['$rootScope', 'resilienzManagerDataProvider', function ($rootScope, resilienzManagerDataProvider) {
      var self = this
      self.isLoading = true
      self.final = false
      resilienzManagerDataProvider.action($rootScope.id).then(function (action) {
        console.log(action)
        self.final = action.finalized
        self.isLoading = false
      }, function (error) {
        console.error(error)
      })
      self.finalize = function () {
        self.isLoading = true
        resilienzManagerDataProvider.actionMakeFinal($rootScope.action).then(function () {
          self.final = true
          self.isLoading = false
        }, function (error) {
          console.error(error)
        })
      }
    }])
}())
