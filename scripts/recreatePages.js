var config = require('../config.json')
var Sync = require('sync')
var Database = require('../lib/database.js')
var Books = require('../lib/books.js')
var database = new Database(config.database)
var books = new Books(database, config.layouts, config.pages, config.images, config.books)

console.log('STC :: Recreating All Pages and Books')

database.getActionList(function (error, actions) {
  if (error) {
    console.error(error)
    process.exit(2)
  } else {
    console.log('Got ' + actions.length + ' Actions')
    for (let index = 0; index < actions.length; index++) {
      const action = actions[index]
      Sync(function () {
        try {
          var pages = database.getActionPages.sync(action.id)
          console.log('Got ' + pages.length + ' pages for action ' + action.id)
          if (pages.length > 0) {
            for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
              const page = pages[pageIndex]
              try {
                var category = database.getCategoryByPage.sync(page)
                try {
                  books.createPage.sync(action.id, category.id, page, action.language, '-2', false)
                  console.log('Page ' + page + ' created.')
                } catch (error) {
                  console.error(error)
                  process.exit(2)
                }
              } catch (error) {
                console.error(error)
                process.exit(2)
              }
              try {
                var book = books.makeBook.sync(action.id, action.language)
                console.log('Book ' + book + ' created.')
              } catch (error) {
                console.error(error)
                process.exit(2)
              }
            }
          }
        } catch (error) {
          console.error(error)
          process.exit(2)
        }
      })
    }
    console.log('DONE')
  }
})
