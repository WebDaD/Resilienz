/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Layout', ['$scope', 'resilienzManagerDataProvider', '$uibModal', '$rootScope', function ($scope, resilienzManagerDataProvider, $uibModal, $rootScope) {
      var self = this
      self.dropzoneConfig = {
        parallelUploads: 1,
        maxFileSize: 10,
        maxFiles: 1
      }
      // TODO: remeber: pages have _two if not page 1 or 44 (not seen anyways)
      // TODO: remeber: we have the first page as to give to the backend. just show the other one (page+1)
      self.actionid = $rootScope.action
      self.catLoading = true
      // load cats with layouts and positions
      resilienzManagerDataProvider.categoriesFull().query(function (categories) {
        self.categories.all = categories // {id, sort: -1, name: '', pages: -1, layouts: []}
        // TODO: loop all layouts.positions and Add function upload where image=false
        self.categories.previous = {}
        self.categories.active = categories[0]
        self.categories.next = categories[1]
        self.selectedPage = 1
        self.selectedLayout = self.categories.active.layouts[0] // {image, width, height, imagepath, id}
        self.catLoading = false
      })
      self.catPrevious = function () {
        self.catLoading = true
        self.categories.next = self.categories.active
        self.categories.active = self.categories.previous
        // TODO: set previous
        self.catLoading = false
      }
      self.catNext = function () {
        self.catLoading = true
        self.categories.previous = self.categories.active
        self.categories.active = self.categories.next
        // TODO: set next
        self.catLoading = false
      }
      self.switchToPage = function (nr) {

      }
      self.openEditor = function (position) {
        var data = {}
        data.image = position.imagepath
        data.width = position.width
        data.height = position.height
        $uibModal.open({
          animation: true,
          templateUrl: 'modals/editor',
          controller: 'resilienzManager-Editor',
          controllerAs: 'ctrl',
          size: 'lg',
          resolve: {
            data: function () {
              return data
            }
          }
        })
      }
      self.arrayFromPages = function (num) {
        return new Array(num)
      }
      function upload (file) {
        // TODO; make use of this to get position id
        // TODO: upload file, add to postions
      }
    }])
}())
