/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Layout', ['$scope', 'resilienzManagerDataProvider', '$uibModal', '$rootScope', '$window', function ($scope, resilienzManagerDataProvider, $uibModal, $rootScope, $window) {
      var self = this
      self.dropzoneConfig = {
        parallelUploads: 1,
        maxFileSize: 10,
        maxFiles: 1
      }
      self.categories = []
      self.actionid = $rootScope.action
      self.catLoading = true
      self.pageLoading = true
      self.pageWidth = angular.element(document.getElementById('#page')).clientWidth
      self.pageHeight = angular.element(document.getElementById('#page')).clientHeight

      self.selectedCategory = {}
      self.selectedLayout = {}
      self.selectedPage = -1

      self.selectCategory = function () {
        self.catLoading = true
        self.selectedPage = self.selectedCategory.startpage
        self.catLoading = false
        self.pageLoading = true
      }
      self.selectPage = function () {

      }
      self.selectLayout = function () {
        self.pageLoading = true
        reloadLayoutPositions(function () { self.pageLoading = false })
      }
      angular.element($window).on('resize', function () {
        self.pageWidth = angular.element(document.getElementById('#page')).clientWidth
        self.pageHeight = angular.element(document.getElementById('#page')).clientHeight
      })

      // load cats with layouts and positions
      resilienzManagerDataProvider.categoriesFull().then(function (categories) {
        self.categories = categories.data // {id, sort: -1, name: '', pages: -1, startpage: 0, layouts: [], translation}
        self.selectedCategory = self.categories[0]
        self.selectedPage = self.selectedCategory.realPages[0]
        self.catLoading = false
        reloadLayoutPositions(function () { self.pageLoading = false })
      })

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
        resilienzManagerDataProvider.imageDelete(position.image).then(function (something) {})
      }
      self.saveLayout = function () {
        self.pageLoading = true
        resilienzManagerDataProvider.actionSaveLayout(this.actionid, this.selectedPage, this.selectedLayout).then(function (something) {
          reloadLayoutPositions(function () { self.pageLoading = false })
        })
      }
      function reloadLayoutPositions (callback) {
        resilienzManagerDataProvider.getLayoutImagesByActionPage(self.actionid, self.selectedPage).then(function (layoutWithImages) {
          self.selectedLayout = layoutWithImages.data
          self.pageImage = {
            'background-image': 'url(/bookimages/' + self.actionid + '/' + self.selectedPage + ')'
          }
          callback()
        })
      }
      self.calcStyle = function (position) {
        var style = {}
        var orgWidth = (self.categories.active.id === '1') ? 720 : 1440
        var orgHeight = 1040
        style.left = (position.x * self.pageWidth / orgWidth) + 'px'
        style.top = (position.y * self.pageHeight / orgHeight) + 'px'
        style.width = (position.width * self.pageWidth / orgWidth) + 'px'
        style.height = (position.height * self.pageHeight / orgHeight) + 'px'
        style.transform = 'rotate(' + position.spin + 'deg)'
        return style
      }
    }])
}())
