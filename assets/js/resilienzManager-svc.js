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
          getPositionImage: function (actionid, positionid) {
            return $http({
              method: 'GET', url: restURL + 'positions/' + actionid + '/' + positionid + '/image'
            })
          },
          imageRescale: function (name, data) {
            return $http({
              method: 'PUT', url: restURL + 'bookimages/' + name + '/rescale', data: data
            })
          },
          imageDelete: function (name) {
            return $http({
              method: 'DELETE', url: restURL + 'bookimages/' + name
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
          actionSaveLayout: function (id, page, layoutId) {
            return $http({
              method: 'PUT', url: restURL + 'actions/' + id + '/' + page + '/layout', data: layoutId
            })
          }
        }
      }
    })
}())
