/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Manage', ['$rootScope', 'resilienzManagerDataProvider', '$cookies', function ($rootScope, resilienzManagerDataProvider, $cookies) {
      var self = this
      self.actions = []
      self.isLoading = true
      self.actionCreating = false
      self.newActionComment = ''
      self.activeActionid = $rootScope.action
      self.reload = function () {
        var self = this
        self.actions = []
        self.isLoading = true
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
      }
      self.createBook = function (actionId) {
        resilienzManagerDataProvider.createBook(actionId).then(function (book) {
          self.reload()
        }, function (error) {
          console.error(error)
        })
      }
      self.switchAction = function (actionId) {
        resilienzManagerDataProvider.switchToAction($rootScope.id, actionId).then(function (result) {
          if (result.data) {
            $rootScope.action = actionId
            $cookies.set('resilienzManager-action', actionId)
            self.reload()
          } else {
            console.error('Some Error')
          }
        }, function (error) {
          console.error(error)
        })
      }
      self.createAction = function () {
        self.actionCreating = true
        resilienzManagerDataProvider.createAction($rootScope.id, self.newActionComment).then(function (result) {
          self.newActionComment = ''
          self.reload()
          self.actionCreating = false
        }, function (error) {
          console.error(error)
        })
      }
      self.reload()
    }])
}())
