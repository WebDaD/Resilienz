/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Manage', ['$rootScope', 'resilienzManagerDataProvider', function ($rootScope, resilienzManagerDataProvider) {
      var self = this
      self.actions = []
      self.isLoading = true
      self.activeActionid = $rootScope.action
      resilienzManagerDataProvider.actions($rootScope.id).then(function (actions) {
        self.actions = actions.data
        self.isLoading = false
      }, function (error) {
        console.error(error)
      })
      self.createBook = function (actionId) {

      }
      self.switchAction = function (actionId) {
        
      }
    }])
}())
