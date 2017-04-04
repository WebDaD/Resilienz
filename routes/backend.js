/**
 * @overview Route Frontend File
 * @module index
 * @author Dominik Sigmund
 * @version 1.0
 * @description Exports frontend routes
 * @memberof resilienz
 */

 /** Exports Routes
 * @param {object} app - Express app
 * @param {object} database - Database Object
 * @param {object} language - language Object
 * @param {object} login - login Object
 * @param {object} layouter - layouter Object
 * @param {object} bookGenerator - bookGenerator Object
 */
module.exports = function (app, database, language, login, layouter, bookGenerator) {
  // ADMIN ONLY
  app.get('/users', login.isLoggedIn(), login.isAdmin(), function (req, res) {
    database.getUsers(function (error, users) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.json(users)
      }
    })
  })
  app.get('/actions', login.isLoggedIn(), login.isAdmin(), function (req, res) {
    database.getActions(function (error, actions) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.json(actions)
      }
    })
  })
}
