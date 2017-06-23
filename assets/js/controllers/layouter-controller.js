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
      self.pageLoading = true
      // load cats with layouts and positions
      resilienzManagerDataProvider.categoriesFull().success(function (categories) {
        self.categories.all = categories // {id, sort: -1, name: '', pages: -1, startpage: 0, layouts: []}
        self.categories.previous = {}
        self.categories.active = categories[0]
        self.categories.next = categories[1]
        self.selectedPage = 1
        self.catLoading = false
        reloadLayoutPositions(function () { self.pageLoading = false })
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
        self.selectedPage = self.categories.active.startpage + self.categories.active.pages - 1 // minus one to get the lefthand page
        self.catLoading = false
        reloadLayoutPositions(function () { self.pageLoading = false })
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
        self.selectedPage = self.categories.active.startpage
        self.catLoading = false
        reloadLayoutPositions(function () { self.pageLoading = false })
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
      self.saveLayout = function () {
        resilienzManagerDataProvider.actionSaveLayout(this.actionid, this.selectedPage, $scope.selectedItem).success(function (something) {})
      }
      self.selectPage = function (page) {
        self.pageLoading = true
        self.selectedPage = page
        reloadLayoutPositions(function () { self.pageLoading = false })
      }
      function reloadLayoutPositions (callback) {
        resilienzManagerDataProvider.getLayoutImagesByActionPage(self.actionid, self.selectedPage).success(function (layoutWithImages) {
          self.selectedLayout = layoutWithImages
          callback()
        })
      }
    }])
}())
