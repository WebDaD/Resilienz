/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Layout', ['$scope', 'resilienzManagerDataProvider', '$uibModal', function ($scope, resilienzManagerDataProvider, $uibModal) {
      var self = this
      self.actionid = -1 // TODO: from rootScope?
      self.categories = {}
      self.categories.all = [] // TODO: load
      self.categories.previous = {sort: -1, name: '', pages: -1}
      self.categories.next = {sort: -1, name: '', pages: -1}
      self.categories.active = {sort: -1, name: '', pages: -1}
      self.selectedPage = -1

      self.layouts = [] // TODO: load {id, name, positions}
      self.selectedLayout = {id: -1, name: '', positions: []} // TODO: positions: {image:true/false, id}
      self.switchToCategorie = function (cat_order) {

      }
      self.switchToPage = function(nr) {

      }
      self.openEditor = function(position_id) {
        $uibModal.open({
          animation: true,
          templateUrl: 'modals/editor',
          controller: 'resilienzManager-Editor',
          controllerAs: 'ctrl',
          size: 'lg',
          resolve: { // TODO: give date to editor
            data: function () {
              return data
            }
          }
        })
      }
      self.arrayFromPages = function(num) {
        return new Array(num)
      }
    }])
}())
