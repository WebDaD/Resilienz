/**
 * @overview Main Server File
 * @module index
 * @author Dominik Sigmund
 * @version 0.1
 * @description Starts the Server and keeps it running
 * @memberof resilienz
 */

 // Require needed modules
console.log('Starting up resilienz-app...')
console.log('Pulling in dependencies...')
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var pack = require('./package.json')
var config = require('./config.json')
var bodyParser = require('body-parser')
var Database = require('./lib/database.js')
var Status = require('./lib/status.js')
var Language = require('./lib/language.js')
var Login = require('./lib/login.js')
var Layouter = require('./lib/layouter.js')
var BookGenerator = require('./lib/book-generator.js')
var path = require('path')
var cookieParser = require('cookie-parser')
var bcrypt = require('bcrypt')

console.log('Setting Static paths...')
// Send public and docs
app.use(express.static(path.join(__dirname, 'public')))
app.use('/docs', express.static(path.join(__dirname, 'doc')))

// Add rendering Engine
app.set('view engine', 'pug')

// Add Cookie Cababilities
app.use(cookieParser())

// Accept JSON Body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Objects
console.log('Creating Objects...')
var database = new Database(config.database)
Language(database, function (error, language) {
  if (error) {
    console.error(error)
    database.close(function () {
      process.exit()
    })
  } else {
    var login = new Login(database, language, bcrypt, config.salt, config.serversecret)
    var layouter = new Layouter(config.images, config.pages, database)
    var bookGenerator = new BookGenerator(layouter, config.pages, config.books, config.bookpages)
    var status = new Status()
    // Routes
    console.log('Loading Routes...')
    require('./routes')(app, database, language, login, layouter, bookGenerator, status, config)

    // Listen to Port
    server.listen(config.port)

    console.log('Startup Complete')
    console.log('Using Database ' + config.database.database)
    console.log(pack.name + '@' + pack.version + ' running on Port ' + config.port)
  }
})

/** Handles exitEvents by destroying vks first
* @param {object} options - Some Options
* @param {object} err - An Error Object
*/
function exitHandler (options, err) {
  console.log('Exiting...')
  database.close()
  process.exit()
}
// catches ctrl+c event
process.on('SIGINT', exitHandler)
// catches uncaught exceptions
process.on('uncaughtException', function (err) {
  console.error(err)
  exitHandler(null, err)
})

// keep running
process.stdin.resume()
