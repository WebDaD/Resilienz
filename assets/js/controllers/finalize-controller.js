/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Finalize', ['$rootScope', 'resilienzManagerDataProvider', function ($rootScope, resilienzManagerDataProvider) {
      var self = this
      self.isLoading = true
      self.final = false
      self.actionid = $rootScope.action
      resilienzManagerDataProvider.actions.get({id: self.actionid}, function (action) {
        self.final = action.finalized
        self.isLoading = false
      })
      self.finalize = function () {
        self.isLoading = true
        resilienzManagerDataProvider.actions.makeFinal({id: self.actionid}, function () {
          self.final = true
          self.isLoading = false
        })
      }
    }])
}())
