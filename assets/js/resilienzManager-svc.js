/* global angular */
;(function () {
  angular.module('resilienzManager')
    .provider('resilienzManagerDataProvider', function resilienzManagerDataProvider () {
      var restURL = '/'
      this.setURL = function (url) {
        restURL = url
      }
      this.$get = function ($resource, $http) {
        return {
          users: function () {
            return $resource(restURL + 'users/:id', {id: '@id'})
          },
          categoriesFull: function () {
            return $resource(restURL + 'categories/full')
          },
          actions: function () {
            return $resource(restURL + 'actions/:id', {id: '@id'}, {
              makeFinal: {
                method: 'PUT',
                url: restURL + 'actions/:id/finalize',
                params: {id: '@id'}
              }
            })
          }
        }
      }
    })
}())
