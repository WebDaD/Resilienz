/* global angular */
;(function () {
  angular.module('resilienzManager')
    .provider('resilienzManagerDataProvider', function resilienzManagerDataProvider () {
      var restURL = '/'
      this.setURL = function (url) {
        restURL = url
      }
      this.$get = function ($http) {
        return {
          users: function () {
            return $http({
              method: 'GET', url: restURL + 'users/'
            })
          },
          actions: function () {
            return $http({
              method: 'GET', url: restURL + 'actions/'
            })
          },
          action: function (id) {
            return $http({
              method: 'GET', url: restURL + 'actions/' + id
            })
          },
          actionsForUser: function (id) {
            return $http({
              method: 'GET', url: restURL + 'actions/user/' + id
            })
          },
          categoriesFull: function () {
            return $http({
              method: 'GET', url: restURL + 'categories/full'
            })
          },
          getLayoutImagesByActionPage: function (actionid, page) {
            return $http({
              method: 'GET', url: restURL + 'actions/' + actionid + '/' + page + '/layout'
            })
          },
          getPositionImage: function (actionid, page, positionid) {
            return $http({
              method: 'GET', url: restURL + 'positions/' + actionid + '/' + page + '/' + positionid + '/image'
            })
          },
          createPage: function (actionid, category, page, id, removed) {
            return $http({
              method: 'PATCH', url: restURL + 'bookimages/' + actionid + '/' + category + '/' + page + '/' + id + '/' + (removed ? '1' : '0')
            })
          },
          imageRescale: function (name, data, cw, ch, width, height) {
            var sd = data
            sd.cw = cw
            sd.ch = ch
            sd.imageWidth = width
            sd.imageHeight = height
            return $http({
              method: 'PUT', url: restURL + 'bookimages/' + name + '/rescale', data: sd
            })
          },
          imageDelete: function (name) {
            return $http({
              method: 'DELETE', url: restURL + 'bookimages/' + name
            })
          },
          textSave: function (actionId, page, positionId, value) {
            return $http({
              method: 'PUT', url: restURL + 'booktext/save/' + actionId + '/' + page + '/' + positionId + '', data: value
            })
          },
          actionMakeFinal: function (id) {
            return $http({
              method: 'PUT', url: restURL + 'actions/' + id + '/finalize'
            })
          },
          createBook: function (id) {
            return $http({
              method: 'PUT', url: restURL + 'book/' + id
            })
          },
          switchToAction: function (userId, actionId) {
            return $http({
              method: 'PATCH', url: restURL + 'actions/' + userId + '/switch/' + actionId
            })
          },
          createAction: function (userId, comment) {
            return $http({
              method: 'POST', url: restURL + 'actions/' + userId, data: {comment: comment}
            })
          },
          actionSaveLayout: function (id, page, layoutId) {
            return $http({
              method: 'PUT', url: restURL + 'actions/' + id + '/' + page + '/layout', data: layoutId
            })
          }
        }
      }
    })
}())
