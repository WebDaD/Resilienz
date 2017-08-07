/* global angular */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Layout', ['$scope', 'resilienzManagerDataProvider', '$uibModal', '$rootScope', '$window', function ($scope, resilienzManagerDataProvider, $uibModal, $rootScope, $window) {
      var self = this
      self.categories = []
      self.final = false
      self.actionid = $rootScope.action
      self.catLoading = true
      self.pageLoading = true

      self.selectedCategory = {}
      self.selectedLayout = {}
      self.selectedPage = -1

      self.selectCategory = function () {
        self.catLoading = true
        self.selectedPage = self.selectedCategory.startpage
        self.catLoading = false
        reloadLayoutPositions(function () {}) // uses page to selectLayout
      }
      self.selectPage = function () {
        reloadLayoutPositions(function () {}) // uses page to selectLayout
      }
      self.onLayoutSelectCallback = function ($item, $model) {
        if (!self.final) {
          if ($item) {
            self.pageLoading = true
            resilienzManagerDataProvider.actionSaveLayout(self.actionid, self.selectedPage, $item).then(function (something) {
              reloadLayoutPositions(function () { })
            })
          }
        }
      }
      // load cats with layouts and positions
      resilienzManagerDataProvider.categoriesFull().then(function (categories) {
        self.categories = categories.data // {id, sort: -1, name: '', pages: -1, startpage: 0, layouts: [], translation}
        self.selectedCategory = self.categories[0]
        self.selectedPage = self.selectedCategory.startpage
        self.catLoading = false
        resilienzManagerDataProvider.action($rootScope.id).then(function (action) {
          self.final = (action.data.finalized === 1)
          reloadLayoutPositions(function () {})
        }, function (error) {
          console.error(error)
        })
      })
      self.openEditor = function (position) {
        if (!self.final) {
          var data = {}
          data.image = position.image
          data.width = position.width
          data.height = position.height
          var modalInstance = $uibModal.open({
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
          modalInstance.result.then(function (image) {
            position.style['background-image'] = 'url(/layout/image/' + image + '?v=' + Math.floor((Math.random() * 1000) + 1) + ')'
          })
        }
      }
      self.delete = function (position) {
        if (!self.final) {
          position.deleting = true
          resilienzManagerDataProvider.imageDelete(position.image).then(function (something) {
            position.style['background-image'] = 'url(/layout/image/placeholder)'
            position.image = undefined
          })
        }
      }
      self.uploadError = function (file, errorMessage) {
        console.error(errorMessage)
      }
      self.dragEnter = function (event) {
        event.currentTarget.parentElement.style.outline = '2px solid #1BFF1B'
      }
      self.dragLeave = function (event) {
        event.currentTarget.parentElement.style.outline = '0px'
      }
      self.sending = function (file, xhr, formData) {
        self.selectedLayout.positions[parseInt(this.element.parentElement.attributes['data-position-index'].value)].sending = true
        $scope.$apply()
      }
      self.success = function (file, response) {
        var position = self.selectedLayout.positions[parseInt(this.element.parentElement.attributes['data-position-index'].value)]
        resilienzManagerDataProvider.getPositionImage(self.actionid, position.id).then(function (image) {
          position.image = image.data
          position.sending = false
          position.deleting = false
          position.style['background-image'] = 'url(/layout/image/' + image.data + '?v=' + Math.floor((Math.random() * 1000) + 1) + ')'
        })
      }
      function reloadLayoutPositions (callback) {
        resilienzManagerDataProvider.getLayoutImagesByActionPage(self.actionid, self.selectedPage).then(function (layoutWithImages) {
          self.pageLoading = true
          self.selectedLayout = {}
          self.selectedLayout = layoutWithImages.data
          self.pageImage = {
            'background-image': 'url(/layout/background/' + self.selectedPage + '?v=' + Math.floor((Math.random() * 1000) + 1) + ')'
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
              'transform': 'rotate(' + position.spin + 'deg)',
              'background-image': 'url(/layout/image/' + position.image + '?v=' + Math.floor((Math.random() * 1000) + 1) + ')'
            }
            position.dropzoneConfig = {
              parallelUploads: 1,
              maxFileSize: 10,
              url: position.action,
              paramName: 'dropzone',
              method: 'post'
            }
            position.index = i
            position.sending = false
            position.deleting = false
          }
          self.pageLoading = false
          callback()
        })
      }
    }])
}())
