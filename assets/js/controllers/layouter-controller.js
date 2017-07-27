/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Layout', ['$scope', 'resilienzManagerDataProvider', '$uibModal', '$rootScope', '$window', function ($scope, resilienzManagerDataProvider, $uibModal, $rootScope, $window) {
      var self = this
      self.categories = []
      self.actionid = $rootScope.action
      self.catLoading = true
      self.pageLoading = true

      self.selectedCategory = {}
      self.selectedLayout = {}
      self.layoutChanged = false
      self.selectedPage = -1

      self.selectCategory = function () {
        self.catLoading = true
        self.selectedPage = self.selectedCategory.startpage
        self.catLoading = false
        self.pageLoading = true
        reloadLayoutPositions(function () {}) // uses page to selectLayout
      }
      self.selectPage = function () {
        self.pageLoading = true
        reloadLayoutPositions(function () {}) // uses page to selectLayout
      }
      self.selectLayout = function () {
        self.pageLoading = true
        self.layoutChanged = true
        reloadLayoutPositions(function () {}) // uses page to selectLayout
      }

      // load cats with layouts and positions
      resilienzManagerDataProvider.categoriesFull().then(function (categories) {
        self.categories = categories.data // {id, sort: -1, name: '', pages: -1, startpage: 0, layouts: [], translation}
        self.selectedCategory = self.categories[0]
        self.selectedPage = self.selectedCategory.startpage
        self.catLoading = false
        reloadLayoutPositions(function () {})
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
        resilienzManagerDataProvider.imageDelete(position.image).then(function (something) {
          self.pageLoading = true
          reloadLayoutPositions(function () {})
        })
      }
      self.saveLayout = function () {
        self.pageLoading = true
        resilienzManagerDataProvider.actionSaveLayout(this.actionid, this.selectedPage, this.selectedLayout).then(function (something) {
          self.layoutChanged = false
          reloadLayoutPositions(function () { })
        })
      }
      self.uploadOK = function () {
        console.log('upload OK')
        self.pageLoading = true
        reloadLayoutPositions(function () {})
      }
      self.uploadError = function (file, errorMessage) {
        console.error(errorMessage)
      }
      function reloadLayoutPositions (callback) {
        resilienzManagerDataProvider.getLayoutImagesByActionPage(self.actionid, self.selectedPage).then(function (layoutWithImages) {
          self.selectedLayout = layoutWithImages.data
          self.pageImage = {
            'background-image': 'url(/bookimages/' + self.actionid + '/' + self.selectedPage + '?v=' + Math.floor((Math.random() * 1000) + 1) + ')'
          }
          var orgWidth = (self.selectedCategory.id === '1') ? 720 : 1440
          var orgHeight = 1040
          var pageHeight = 700
          var pageWidth = ((orgWidth * pageHeight) / orgHeight)
          for (var i = 0; i < self.selectedLayout.positions.length; i++) {
            var position = self.selectedLayout.positions[i]
            position.style = {
              'left': (position.x * pageWidth / orgWidth) + 'px',
              'top': (position.y * pageHeight / orgHeight) + 'px',
              'width': (position.width * pageWidth / orgWidth) + 'px',
              'height': (position.height * pageHeight / orgHeight) + 'px',
              'transform': 'rotate(' + position.spin + 'deg)'
            }
            position.dropzoneConfig = {
              parallelUploads: 1,
              maxFileSize: 10,
              maxFiles: 1,
              url: position.action,
              paramName: 'dropzone',
              method: 'post'
            }
          }
          self.pageLoading = false
          callback()
        })
      }
    }])
}())
