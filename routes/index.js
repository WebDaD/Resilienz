/**
 * @overview Route Index File
 * @module index
 * @author Dominik Sigmund
 * @version 1.0
 * @description Exports all Routes
 * @memberof resilienz
 */

 /** Exports Routes
 * @param {object} app - Express app
 * @param {object} database - Database Object
 * @param {object} language - language Object
 * @param {object} login - login Object
 * @param {object} layouter - layouter Object
 * @param {object} bookGenerator - bookGenerator Object
* @param {object} config - config Object
 */
module.exports = function (app, database, language, login, layouter, bookGenerator, config) {
  /** Middleware to Log every route
  * @param {object} req - Express.req Object
  * @param {object} res - Express.res Object
  * @param {object} next - Express.next Object
  * @returns {undefined}
  */
  app.use(function (req, res, next) {
    // console.log(req)
    next()
  })
  // Load Backend Routes
  require('./backend.js')(app, database, language, login, layouter, bookGenerator, config)
  // Load UI Routes
  require('./frontend.js')(app, language, login)
  // Load Login Routes
  require('./login.js')(app, language, login, config)

  // Sends status information
  app.get('/status', function (req, res) {
    // TODO get status
  })
  /** Middleware to Catch Errors
  * @param {object} err - Express.err Object
  * @param {object} req - Express.req Object
  * @param {object} res - Express.res Object
  * @param {object} next - Express.next Object
  * @returns {undefined}
  */
  app.use(function (err, req, res, next) {
    console.error(err)
  })
}
