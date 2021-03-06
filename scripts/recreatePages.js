var config = require('../config.json')
var Database = require('../lib/database.js')
var Books = require('../lib/books.js')
var fs = require('fs')
var path = require('path')
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
      var pageCounter = 0
      var pageMax = 0
      console.log('Got ' + actionCounter + ' Actions')
      for (let index = 0; index < actionCounter; index++) {
        const action = actions[index]
        database.getActionPages(action.id, function (error, pages) {
          if (error) {
            console.error(error)
          } else {
            console.log('Got ' + pages.length + ' pages for action ' + action.id)
            pageMax += pages.length
            if (pages.length > 0) {
              for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                const page = pages[pageIndex].page.toString()
                database.getCategoryByPage(page, function (error, category) {
                  if (error) {
                    console.error(error)
                  } else {
                    console.log('Processing Page ' + page + ' in category ' + category[0].id + ' for action ' + action.id)
                    books.createPage(action.id.toString(), category[0].id.toString(), page, action.language, '-2', false, function (error, result) {
                      if (error) {
                        console.error(error)
                      } else {
                        console.log('Page ' + page + ' for action ' + action.id + ' Done')
                      }
                      pageCounter++
                      if (pageMax === pageCounter) {
                        console.log('STC :: done')
                        process.exit(0)
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
        if (!fs.existsSync(path.join(config.pages, action.id.toString(), 'tmp'))) {
          fs.mkdirSync(path.join(config.pages, action.id.toString(), 'tmp'))
        }
        if (!fs.existsSync(path.join(config.pages, action.id.toString(), 'pages'))) {
          fs.mkdirSync(path.join(config.pages, action.id.toString(), 'pages'))
        }
        if (!fs.existsSync(path.join(config.pages, action.id.toString(), 'book'))) {
          fs.mkdirSync(path.join(config.pages, action.id.toString(), 'book'))
        }
        books.makeBook(action.id.toString(), action.language, function (error, book) {
          if (error) {
            console.error(error)
          } else {
            console.log('Book ' + book + ' done.')
          }
          bookCounter++
          if (actionCounter === bookCounter) {
            console.log('STC :: done')
            process.exit(0)
          }
        })
      }
    }
  })
}
