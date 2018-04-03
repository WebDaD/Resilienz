var config = require('../config.json')
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
    var actionCounter = actions.length
    var bookCounter = 0
    console.log('Got ' + actionCounter + ' Actions')
    for (let index = 0; index < actionCounter; index++) {
      const action = actions[index]
      try {
        var pages = database.getActionPagesSync(action.id)
        console.log('Got ' + pages.length + ' pages for action ' + action.id)
        if (pages.length > 0) {
          for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            const page = pages[pageIndex]
            var category = database.getCategoryByPageSync(page)
            var result = books.createPage(action.id, category.id, page, action.language, '-2', false)
            if (result) {
              console.log('Page ' + page + ' Done')
            }
          }
          books.makeBook(action.id, action.language, function (error, book) {
            if (error) {
              console.error(error)
            } else {
              console.log('Book ' + book + ' done.')
            }
            bookCounter++
            if (actionCounter === bookCounter) {
              console.log('done')
            }
          })
        }
      } catch (e) {
        console.error(error)
        process.exit(2)
      }
    }
  }
})
