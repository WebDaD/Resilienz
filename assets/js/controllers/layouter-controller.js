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
      resilienzManagerDataProvider.categoriesFull().success(function (categories) {
        self.categories.all = categories // {id, sort: -1, name: '', pages: -1, layouts: []}
        self.categories.previous = {}
        self.categories.active = categories[0]
        self.categories.next = categories[1]
        self.selectedPage = 1
        resilienzManagerDataProvider.getLayoutImagesByActionPage(self.actionid, self.selectedPage).success(function (layoutWithImages) {
          // TODO: add Data to fitting points (selectedLayout, ctrl.selectedLayout.positions (image, widh, height))

          self.catLoading = false
        })
      })

      //TODO: on cat/page Change, reload getLayoutImagesByActionPage
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
        self.selectedPage = 1 // TODO: must be last Page of categorie
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
        self.selectedPage = 1 // TODO: must be first Page of categorie
        self.catLoading = false
      }
      self.openEditor = function (position) {
        var data = {}
        data.image = position.image
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
      self.delete = function (position) {
        resilienzManagerDataProvider.imageDelete(position.image).success(function (something) {})
      }
      self.arrayFromPages = function (num) {
        return new Array(num)
      }
      self.saveLayout = function () {
        resilienzManagerDataProvider.actionSaveLayout(this.actionid, this.selectedPage, $scope.selectedItem).success(function (something) {})
      }
    }])
}())
