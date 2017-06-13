var diskspace = require('diskspace')
var os = require('os')
function Status (config) {
  var self = {}
  self.info = info
}
function info (callback) {
  var info = {}
  diskspace.check('/', function (err, result) {
    if (err) {
      info.diskspace = null
    } else {
      info.diskspace = result
    }
    info.memory = {}
    info.memory.free = os.freemem()
    info.memory.total = os.totalmem()
    info.cpus = os.cpus()
    info.hostname = os.hostname()
    info.load = os.loadavg()
    info.uptime = os.uptime()
    callback(info)
  })
}

module.exports = Status
