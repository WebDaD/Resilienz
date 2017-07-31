/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Finalize', ['$rootScope', 'resilienzManagerDataProvider', function ($rootScope, resilienzManagerDataProvider) {
      var self = this
      self.isLoading = true
      self.final = false
      self.creating = false
      self.actionid = $rootScope.action
      resilienzManagerDataProvider.action($rootScope.id).then(function (action) {
        self.final = (action.data.finalized === 1)
        self.book = action.data.book
        self.isLoading = false
      }, function (error) {
        console.error(error)
      })
      self.createBook = function () {
        self.creating = true
        resilienzManagerDataProvider.createBook($rootScope.action).then(function () {
          self.creating = false
        }, function (error) {
          console.error(error)
        })
      }
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
