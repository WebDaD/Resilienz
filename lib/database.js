/**
 * @overview Database Lib
 * @module database
 * @author Dominik Sigmund
 * @version 0.1
 * @description Positions Images on Layouts
 * @memberof resilienz
 * @requires module:mysql
 */

function Database (config) {
  var self = {}
  self.config = config
  self.mysql = require('mysql')
  self.connection = self.mysql.createPool({
    connectionLimit: 100,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  })
  self.getCategoriesFull = getCategoriesFull
  self.getLayoutImagesByActionPage = getLayoutImagesByActionPage
  self.getImage = getImage
  self.addImage = addImage
  self.removeImage = removeImage
  self.getUsers = getUsers
  self.getUser = getUser
  self.addUser = addUser
  self.addAdminUser = addAdminUser
  self.updatePassword = updatePassword
  self.actionFinalize = actionFinalize
  self.saveLayout = saveLayout
  self.getActions = getActions
  self.getAction = getAction
  self.getLanguages = getLanguages
  self.getTranslations = getTranslations
  self.getLayoutInfo = getLayoutInfo
  self.close = close
  return self
}
function getCategoriesFull (callback) {
  var self = this
  self.connection.query('SELECT c.id, c.name, c.pages, c.start_page as startpage, c.ordering, c.lang_string_key, chl.layouts_id, l.name as layoutName p.id as position_id, p.width, p.height FROM categories c, categories_has_layouts chl, positions p, layouts l WHERE c.id=chl.categories_id AND chl.layouts_id=p.layouts_id AND l.id=chl.layouts_id', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      var categories = []
      for (var i = 0; i < results.length; i++) {
        var c = results[i].id - 1
        if (!categories[c]) {
          var cat = {}
          cat.id = results[i].id
          cat.sort = results[i].ordering
          cat.name = results[i].name
          cat.lang_string_key = results[i].lang_string_key
          cat.pages = results[i].pages
          cat.startpage = results[i].startpage
          cat.realPages = []
          for (var x = cat.startpage; x <= cat.startpage + cat.pages; x = x + 2) {
            cat.realPages.push(x)
          }
          cat.layouts = []
          var lay = {}
          lay.id = results[i].layouts_id
          lay.name = results[i].layoutName
          lay.position_id = results[i].position_id
          lay.width = results[i].width
          lay.height = results[i].height
          lay.image = null
          cat.layouts.push(lay)
          categories.push(cat)
        } else {
          var layout = {}
          layout.id = results[i].layouts_id
          layout.name = results[i].layoutName
          layout.position_id = results[i].position_id
          layout.width = results[i].width
          layout.height = results[i].height
          layout.image = null
          categories[c].layouts.push(layout)
        }
      }
      callback(null, categories)
    }
  })
}
function getLayoutImagesByActionPage (actionid, page, callback) {
  var self = this
  self.connection.query('SELECT p.id, p.name, p.height, p.width, iop.image, l.id as layouts_id, l.name as layout_name FROM layouts l, resilienz.actions_has_layouts ahl, resilienz.positions p LEFT JOIN images_on_positions iop ON iop.positions_id=p.id WHERE p.layouts_id=ahl.layouts_id AND l.id = p.layouts_id AND ahl.actions_id=' + actionid + ' AND ahl.page=' + page, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      var layouts = []
      for (var i = 0; i < results.length; i++) {
        var layout = {}
        layout.id = results[i].layouts_id
        layout.name = results[i].layout_name
        layout.positionid = results[i].id
        layout.positionname = results[i].name
        layout.height = results[i].height
        layout.width = results[i].width
        layout.image = results[i].image
      }
      callback(null, layouts)
    }
  })
}
function getImage (actionid, page, positionid, callback) {
  var self = this
  self.connection.query('SELECT iop.image FROM images_on_positions iop, actions_has_layouts ahl WHERE ahl.id = iop.actions_has_layouts_id AND iop.positions_id=' + positionid + ' AND ahl.actions_id=' + actionid + ' AND ahl.page=' + page, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0].name)
    }
  })
}
function addImage (actionid, page, positionid, name, callback) {
  var self = this
  self.connection.query('SELECT id FROM actions_has_layouts WHERE actions_id=' + actionid + ' AND page=' + page, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      self.connection.query('INSERT INTO images_on_positions (action_has_layouts_id, positions_id, image) VALUES (' + results[0].id + ',' + positionid + ',"' + name + '")', function (error, results2, fields) {
        if (error) {
          callback(error)
        } else {
          callback(null, results2.insertId)
        }
      })
    }
  })
}
function removeImage (name, callback) {
  var self = this
  self.connection.query('DELETE FROM images_on_positions WHERE image="' + name + '"', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      if (results.affectedRows === 1) {
        callback(null, true)
      } else {
        callback({msg: 'Error, deleted ' + results.affectedRows + ' rows for name ' + name})
      }
    }
  })
}
function getUsers (callback) {
  var self = this
  self.connection.query('SELECT vorname, nachname, email, language, location FROM userList', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getUser (email, callback) {
  var self = this
  self.connection.query('SELECT a.id AS action_id, u.id AS id, u.email As email, u.admin AS admin, u.password AS password, l.lang_key FROM user u  LEFT JOIN actions a ON a.user_id=u.id LEFT JOIN languages l ON l.id = u.languages_id WHERE u.email="' + email + '" LIMIT 1', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0])
    }
  })
}
function addUser (data, callback) {
  var self = this
  self.connection.query('INSERT INTO user (vorname, nachname, email, password, languages_id) VALUES("' + data.register_vorname + '", "' + data.register_nachname + '", "' + data.register_email + '", "' + data.password + '","' + data.register_language + '")', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      self.connection.query('INSERT INTO actions (location, start_time, end_time, finalized, user_id) VALUES("' + data.register_location + '", "' + data.register_start + '", "' + data.register_stop + '", "0","' + results.insertId + '")', function (error, results2, fields) {
        if (error) {
          callback(error)
        } else {
          callback(null, {id: results.insertId, action_id: results2.insertId, email: data.register_email, language: data.register_language})
        }
      })
    }
  })
}
function addAdminUser (data, callback) {
  var self = this
  self.connection.query('INSERT INTO user (vorname, nachname, email, password, languages_id, admin) VALUES("' + data.register_vorname + '", "' + data.register_nachname + '", "' + data.register_email + '", "' + data.password + '","' + data.register_language + '",1)', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, {id: results.insertId})
    }
  })
}
function updatePassword (email, password, callback) {
  var self = this
  self.connection.query('UPDATE user SET password="' + password + '" WHERE email="' + email + '"', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      if (results.affectedRows === 1) {
        self.getUser(email, callback)
      } else {
        callback({msg: 'Error, updated ' + results.affectedRows + ' rows for email ' + email})
      }
    }
  })
}
function actionFinalize (id, callback) {
  var self = this
  self.connection.query('UPDATE actions SET finalized=1 WHERE id=' + id, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      if (results.affectedRows === 1) {
        callback(null, true)
      } else {
        callback({msg: 'Error, updated ' + results.affectedRows + ' rows for id ' + id})
      }
    }
  })
}
function saveLayout (actionid, page, layoutid, callback) {
  var self = this
  self.connection.query('INSERT INTO actions_has_layouts (actions_id, layouts_id, page) VALUES (' + actionid + ',' + layoutid + ',' + page + ')', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results.insertId)
    }
  })
}
function getActions (callback) {
  var self = this
  self.connection.query('SELECT email, language, location, start_time, end_time, finalized FROM actionList', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getAction (id, callback) {
  var self = this
  self.connection.query('SELECT email, language, location, start_time, end_time, finalized FROM actionList WHERE user_id=' + id, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0])
    }
  })
}
function getLanguages (callback) {
  var self = this
  self.connection.query('SELECT lang_key AS \'key\', name FROM languages', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      var languages = {}
      for (var i = 0; i < results.length; i++) {
        languages[results[i]['key']] = results[i]['name']
      }
      callback(null, languages)
    }
  })
}
function getTranslations (callback) {
  var self = this
  self.connection.query('SELECT language_key, string_key, translation FROM resilienz.language_translations ORDER BY language_key ASC, string_key ASC', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      var translations = {}
      for (var i = 0; i < results.length; i++) {
        if (!translations[results[i]['language_key']]) {
          translations[results[i]['language_key']] = {}
          translations[results[i]['language_key']]['key'] = results[i]['language_key']
        }
        translations[results[i]['language_key']][results[i]['string_key']] = results[i]['translation']
      }
      callback(null, translations)
    }
  })
}

function getLayoutInfo (actionid, page, callback) { // return array of information.{width, height, x, y, imagefile, layoutfile}
  var self = this
  if (page === 2 || page === 44) {
    callback(null, [])
  } else {
    self.connection.query('SELECT poa.width, poa.height, poa.x, poa.y, poa.spin, poa.layouts_id, iop.image, lb.background FROM positions_on_actions poa LEFT JOIN images_on_positions iop ON iop.actions_has_layouts_id=poa.action_has_layouts_id AND iop.positions_id=poa.position_id JOIN layout_backgrounds lb WHERE lb.page=' + page + ' AND poa.actions_id=' + actionid + ' AND poa.page=' + page, function (error, results, fields) {
      if (error) {
        callback(error)
      } else {
        var arr = []
        if (results.length < 1) {
          self.connection.query('SELECT lb.background, p.width, p.height, p.x, p.y, p.spin, chl.layouts_id FROM categories c, categories_has_layouts chl, layout_backgrounds lb, positions p  WHERE  c.id = chl.categories_id AND p.layouts_id = chl.layouts_id AND c.start_page <= ' + page + '  AND c.start_page + c.pages >= ' + page + ' AND lb.page =' + page, function (error, results2, fields) {
            if (error) {
              callback(error)
            } else {
              var selLayout = results2[0].layouts_id
              for (var i = 0; i < results2.length; i++) {
                if (selLayout === results2[i].layouts_id) {
                  var info = {}
                  info.width = results2[i].width
                  info.height = results2[i].height
                  info.x = results2[i].x
                  info.y = results2[i].y
                  info.spin = results2[i].spin
                  info.image = ''
                  info.background = results2[i].background
                  arr.push(info)
                }
              }
              callback(null, arr)
            }
          })
        } else {
          for (var i = 0; i < results.length; i++) {
            var info = {}
            info.width = results[i].width
            info.height = results[i].height
            info.x = results[i].x
            info.y = results[i].y
            info.spin = results[i].spin
            info.image = (results[i].image) ? results[i].image : ''
            info.background = results[i].background
            arr.push(info)
          }
          callback(null, arr)
        }
      }
    })
  }
}
function close (callback) {
  this.connection.end(function (err) {
    if (err) {
      callback()
    } else {
      callback()
    }
  })
}
module.exports = Database
