Dropzone.autoDiscover = false
/* global angular */
;(function () {
  angular.module('resilienzManager', ['ngRoute', 'ngCookies', 'ngTable', 'ui.bootstrap', 'ng-imgAreaSelect', 'ngDropzone', 'ui.select', 'ngSanitize'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/welcome', {
          controller: 'resilienzManager-Welcome',
          controllerAs: 'ctrl',
          templateUrl: 'container/welcome'
        })
        .when('/materials', {
          controller: 'resilienzManager-Materials',
          controllerAs: 'ctrl',
          templateUrl: 'container/materials'
        })
        .when('/layout', {
          controller: 'resilienzManager-Layout',
          controllerAs: 'ctrl',
          templateUrl: 'container/layouter'
        })
        .when('/finish', {
          controller: 'resilienzManager-Finalize',
          controllerAs: 'ctrl',
          templateUrl: 'container/finish'
        })
        .when('/users', {
          controller: 'resilienzManager-Users',
          controllerAs: 'ctrl',
          templateUrl: 'container/users'
        })
        .when('/actions', {
          controller: 'resilienzManager-Actions',
          controllerAs: 'ctrl',
          templateUrl: 'container/actions'
        })
        .otherwise({ redirectTo: '/welcome' })
    }])
    .run(['$cookies', '$rootScope', '$location', '$http', function ($cookies, $rootScope, $location, $http) {
      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if ($rootScope.id === '' || $rootScope.token === '') {
          window.location = '/login'
        }
      })
      $rootScope.isActive = function (viewLocation) { // eslint-disable-line
        return viewLocation === $location.path()
      }
      if (typeof $cookies.get('resilienzManager-id') !== 'undefined' && typeof $cookies.get('resilienzManager-token') !== 'undefined') {
        var adm = $cookies.get('resilienzManager-admin')
        if (typeof adm === 'boolean') {
          $rootScope.admin = adm
        } else {
          $rootScope.admin = adm === 'true'
        }
        $rootScope.id = $cookies.get('resilienzManager-id')
        $rootScope.action = $cookies.get('resilienzManager-action')
        $rootScope.email = $cookies.get('resilienzManager-email')
        $rootScope.token = $cookies.get('resilienzManager-token')
        $http.defaults.headers.common.email = $cookies.get('resilienzManager-email')
        $http.defaults.headers.common.token = $cookies.get('resilienzManager-token')
      } else {
        $rootScope.admin = false
        $rootScope.id = ''
        $rootScope.action = ''
        $rootScope.email = ''
        $rootScope.token = ''
        $http.defaults.headers.common.email = ''
        $http.defaults.headers.common.token = ''
        window.location = '/login'
      }

      $rootScope.logout = function () { // eslint-disable-line
        $cookies.remove('resilienzManager-id')
        $cookies.remove('resilienzManager-action')
        $cookies.remove('resilienzManager-token')
        $cookies.remove('resilienzManager-admin')
        $cookies.remove('resilienzManager-email')
        $rootScope.admin = false
        $rootScope.id = ''
        $rootScope.action = ''
        $rootScope.email = ''
        $rootScope.token = ''
        $http.defaults.headers.common.email = ''
        $http.defaults.headers.common.token = ''
        $location.path('/login')
      }
    }])
}())
