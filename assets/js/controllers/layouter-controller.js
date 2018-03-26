/* global angular, alert */
;(function () {
  angular.module('resilienzManager')
    .controller('resilienzManager-Layout', ['$scope', 'resilienzManagerDataProvider', '$uibModal', '$rootScope', '$window', function ($scope, resilienzManagerDataProvider, $uibModal, $rootScope, $window) {
      var self = this
      self.categories = []
      self.final = false
      self.actionid = $rootScope.action
      self.catLoading = true
      self.pageLoading = true
      self.pageCreating = false

      self.selectedCategory = {}
      self.selectedLayout = {}
      self.selectedPage = -1

      self.renderPage = function () {
        self.pageCreating = true
        resilienzManagerDataProvider.createPage($rootScope.id, self.selectedCategory.id, self.selectedPage).then(function () {
          self.pageCreating = false
        })
      }

      self.enterTextMsg = function () {
        switch ($rootScope.language) {
          case 'de': return 'Text eingeben...'
          case 'en': return 'Enter Text...'
          case 'es': return 'ingrese texto...'
          case 'ar': return '...أدخل النص'
        }
      }

      self.selectCategory = function () {
        self.catLoading = true
        self.selectedPage = self.selectedCategory.startpage
        self.catLoading = false
        reloadLayoutPositions(function () {}) // uses page to selectLayout
      }
      self.selectPage = function () {
        reloadLayoutPositions(function () {}) // uses page to selectLayout
      }
      self.getIconClass = function (symbol) {
        return 'icon-layout_symbols_' + symbol
      }
      self.onLayoutSelectCallback = function ($item, $model) {
        if (!self.final) {
          if ($item) {
            self.pageLoading = true
            resilienzManagerDataProvider.actionSaveLayout(self.actionid, self.selectedPage, $item).then(function (something) {
              reloadLayoutPositions(function () {
                self.renderPage()
              })
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
      self.openInstructions = function () {
        $uibModal.open({
          animation: true,
          templateUrl: 'modals/instructions',
          controller: 'resilienzManager-Instructions',
          controllerAs: 'ctrl',
          size: 'lg'
        })
      }
      self.openEditor = function (position) {
        if (!self.final) {
          var data = {}
          data.image = position.value
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
            self.renderPage()
          })
        }
      }
      self.delete = function (position) {
        if (!self.final) {
          position.deleting = true
          resilienzManagerDataProvider.imageDelete(position.value).then(function (something) {
            position.style['background-image'] = 'url(/layout/image/placeholder)'
            position.value = undefined
            position.type = 'image'
            self.renderPage()
          })
        }
      }
      self.makeText = function (position) {
        if (!self.final) {
          position.isImage = false
          position.changed = false
          position.value = position.oldValue || self.enterTextMsg()
          position.oldValue = position.value
          position.style['background-image'] = 'none'
        }
      }
      self.clearText = function (position) {
        if (!self.final && position.value === self.enterTextMsg()) {
          position.value = ''
        }
      }
      self.makeImage = function (position) {
        if (!self.final) {
          position.isImage = true
          if (position.value !== self.enterTextMsg()) {
            position.value = position.oldValue || ''
            position.oldValue = position.value
          } else {
            position.value = ''
            position.oldValue = ''
          }
          position.style['background-image'] = 'url(/layout/image/' + position.value || 'placeholder' + '?v=' + Math.floor((Math.random() * 1000) + 1) + ')'
        }
      }
      self.saveText = function ($event, position) {
        if (!self.final && position.value !== self.enterTextMsg()) {
          self.selectedLayout.positions[parseInt($event.currentTarget.parentElement.attributes['data-position-index'].value)].sending = true
          // $scope.$apply()
          var size = (position.details.hasOwnProperty('newValue')) ? position.details.newValue : '14'
          resilienzManagerDataProvider.textSave(self.actionid, self.selectedPage, position.id, {'text': size + '|' + position.value}).then(function (something) {
            self.selectedLayout.positions[parseInt($event.currentTarget.parentElement.attributes['data-position-index'].value)].sending = false
            self.selectedLayout.positions[parseInt($event.currentTarget.parentElement.attributes['data-position-index'].value)].changed = false
            self.renderPage()
            // $scope.$apply()
          })
        }
      }
      self.uploadError = function (file, errorMessage) {
        console.error(errorMessage)
      }
      self.dragEnter = function (event) {
        if (!self.final) { event.currentTarget.parentElement.style.outline = '2px solid #1BFF1B' }
      }
      self.dragLeave = function (event) {
        if (!self.final) { event.currentTarget.parentElement.style.outline = '0px' }
      }
      self.sending = function (file, xhr, formData) {
        self.selectedLayout.positions[parseInt(this.element.parentElement.attributes['data-position-index'].value)].sending = true
        $scope.$apply()
      }
      self.toBig = function () {
        var text = ''
        switch ($rootScope.language) {
          case 'de':
            text = 'Bild zu groß. Maximal 2MB erlaubt.'
            break
          case 'en':
            text = 'Image too Big. Max Size is 2MB.'
            break
          case 'es':
            text = 'Image too Big. Max Size is 2MB.'
            break
          case 'ar':
            text = 'Image too Big. Max Size is 2MB.'
            break
        }
        alert(text)
      }
      self.success = function (file, response) {
        var position = self.selectedLayout.positions[parseInt(this.element.parentElement.attributes['data-position-index'].value)]
        resilienzManagerDataProvider.getPositionImage(self.actionid, position.id).then(function (image) {
          position.value = image.data
          position.isImage = true
          position.sending = false
          position.deleting = false
          position.style['background-image'] = 'url(/layout/image/' + image.data + '?v=' + Math.floor((Math.random() * 1000) + 1) + ')'
          self.renderPage()
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
          var orgWidth = (self.selectedCategory.id === '1') ? 2127 : 4254
          var orgHeight = 3072
          var pageHeight = 700
          var pageWidth = ((orgWidth * pageHeight) / orgHeight)
          for (var i = 0; i < self.selectedLayout.positions.length; i++) {
            var background = 'none'
            var position = self.selectedLayout.positions[i]
            position.isImage = false
            position.details = {}
            if (!position.type) {
              if (position.possibleType === 'text') {
                position.value = self.enterTextMsg()
              } else {
                background = 'url(/layout/image/' + position.value + '?v=' + Math.floor((Math.random() * 1000) + 1) + ')'
                position.isImage = true
              }
            } else {
              if (position.type === 'image') {
                background = 'url(/layout/image/' + position.value + '?v=' + Math.floor((Math.random() * 1000) + 1) + ')'
                position.isImage = true
              } else {
                position.value = position.value.split('|')[1]
                position.details = {
                  oldValue: position.value.split('|')[0] + 'px'
                }
              }
            }
            position.style = {
              'left': (position.x * pageWidth / orgWidth) + 'px',
              'top': (position.y * pageHeight / orgHeight) + 'px',
              'width': (position.width * pageWidth / orgWidth) + 'px',
              'height': (position.height * pageHeight / orgHeight) + 'px',
              'transform': 'rotate(' + position.spin + 'deg)',
              'background-image': background
            }
            position.dropzoneConfig = {
              parallelUploads: 1,
              maxFileSize: 2,
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
