var config = require('../config.json')
var Database = require('../lib/database.js')
var Books = require('../lib/books.js')
var database = new Database(config.database)
var books = new Books(database, config.layouts, config.pages, config.images, config.books)

console.log('STC :: Recreating All Pages or Books')

if (process.argv[2] === 'pages') {
  database.getActionList(function (error, actions) {
    if (error) {
      console.error(error)
      process.exit(2)
    } else {
      var actionCounter = actions.length
      console.log('Got ' + actionCounter + ' Actions')
      for (let index = 0; index < actionCounter; index++) {
        const action = actions[index]
        database.getActionPages(action.id, function (error, pages) {
          if (error) {
            console.error(error)
          } else {
            console.log('Got ' + pages.length + ' pages for action ' + action.id)
            if (pages.length > 0) {
              for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                const page = pages[pageIndex].page.toString()
                database.getCategoryByPage(page, function (error, category) {
                  if (error) {
                    console.error(error)
                  } else {
                    books.createPage(action.id.toString(), category.id.toString(), page, action.language, '-2', false, function (error, result) {
                      if (error) {
                        console.error(error)
                      } else {
                        console.log('Page ' + page + ' for action ' + action.id + ' Done')
                      }
                    })
                  }
                })
              }
            }
          }
        })
      }
    }
  })
} else {
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
    }
  })
}
