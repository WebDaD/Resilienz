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
      self.actionid = $rootScope.action
      self.catLoading = true
      // load cats with layouts and positions
      resilienzManagerDataProvider.categoriesFull().query(function (categories) {
        self.categories.all = categories // {id, sort: -1, name: '', pages: -1, layouts: []}
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
        var psort = self.categories.previous.sort - 1
        self.categories.all.forEach(function (cat) {
          if (cat.sort === psort) {
            self.categories.previous = cat
          }
        })
        self.catLoading = false
      }
      self.catNext = function () {
        self.catLoading = true
        self.categories.previous = self.categories.active
        self.categories.active = self.categories.next
        var nsort = self.categories.next.sort + 1
        self.categories.all.forEach(function (cat) {
          if (cat.sort === nsort) {
            self.categories.next = cat
          }
        })
        self.catLoading = false
      }
      self.openEditor = function (position) {
        var data = {}
        data.image = position.imagepath
        data.id = position.imageid
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
    }])
}())
