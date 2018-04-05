/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Manage', ['$rootScope', 'resilienzManagerDataProvider', function ($rootScope, resilienzManagerDataProvider) {
      var self = this
      self.actions = []
      self.isLoading = true
      self.newActionComment = ''
      self.activeActionid = $rootScope.action
      resilienzManagerDataProvider.actionsForUser($rootScope.id).then(function (actions) {
        self.actions = actions.data
        self.actions.map(function (obj) {
          obj.creating = false
          return obj
        })
        self.isLoading = false
      }, function (error) {
        console.error(error)
      })
      self.createBook = function (actionId) {
        // TODO: call create book from svc, then reload this row
      }
      self.switchAction = function (actionId) {
        // TODO: call switch´Action from svc, then reload table
        // TODO: set rootScope Action ID and Cookie!!!
      }
      self.createAction = function () {
        // TODO: call createAction from svc, then reload table, reset newActionComment to ''
      }
    }])
}())
