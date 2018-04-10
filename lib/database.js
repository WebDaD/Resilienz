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
    connectTimeout: 60 * 60 * 1000,
    aquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  })
  self.getCategoriesFull = getCategoriesFull
  self.getBackgroundImage = getBackgroundImage
  self.getLayoutImagesByActionPage = getLayoutImagesByActionPage
  self.getPositionImage = getPositionImage
  self.getImage = getImage
  self.addImage = addImage
  self.saveTextOnPosition = saveTextOnPosition
  self.removeImage = removeImage
  self.updateBookStatus = updateBookStatus
  self.getUsers = getUsers
  self.getUser = getUser
  self.addUser = addUser
  self.addAdminUser = addAdminUser
  self.updatePassword = updatePassword
  self.actionFinalize = actionFinalize
  self.saveLayout = saveLayout
  self.getActions = getActions
  self.getActionsForUser = getActionsForUser
  self.getActionList = getActionList
  self.getAction = getAction
  self.switchAction = switchAction
  self.addAction = addAction
  self.getEmailByAction = getEmailByAction
  self.getLanguages = getLanguages
  self.getLanguageIDFromKey = getLanguageIDFromKey
  self.getTranslations = getTranslations
  self.getLayoutInfo = getLayoutInfo
  self.getCatNamesByLanguage = getCatNamesByLanguage
  self.getActionPages = getActionPages
  self.getCategoryByPage = getCategoryByPage
  self.getActionPagesSync = getActionPagesSync
  self.getCategoryByPageSync = getCategoryByPageSync
  self.close = close
  return self
}
function getCatNamesByLanguage (language, callback) {
  var self = this
  self.connection.query({sql: 'SELECT c.id, t.translation FROM categories c, language_translations t WHERE  t.string_key=c.lang_string_key AND t.language_key="' + language + '" ORDER BY c.id ASC', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getCategoriesFull (language, callback) {
  var self = this
  self.connection.query({sql: 'SELECT c.id, c.name, c.pages, c.start_page as startpage, c.ordering, c.lang_string_key, chl.layouts_id, l.name as layoutName, l.symbol as layoutSymbol, p.id as position_id, p.possible_type as possible_type, p.width, p.height, t.translation FROM categories c, categories_has_layouts chl, positions p, layouts l, language_translations t WHERE c.id=chl.categories_id AND chl.layouts_id=p.layouts_id AND l.id=chl.layouts_id AND t.string_key=c.lang_string_key AND t.language_key="' + language + '"', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      var categories = []
      for (var i = 0; i < results.length; i++) {
        if (!arrayHasObjectWithID(categories, results[i].id)) { //  category must be created
          var cat = {}
          cat.id = results[i].id
          cat.sort = results[i].ordering
          cat.name = results[i].name
          cat.translation = results[i].translation
          cat.lang_string_key = results[i].lang_string_key
          cat.pages = results[i].pages // number of pages. deckblatt = 1, cat2 has 2 pages, but is one double page.
          cat.startpage = results[i].startpage
          cat.realPages = []
          if (cat.pages > 1) {
            var doubles = cat.pages / 2
            if (doubles === 1) {
              cat.realPages.push(cat.startpage)
            } else if (doubles === 2) {
              cat.realPages.push(cat.startpage)
              cat.realPages.push(cat.startpage + 2)
            } else if (doubles === 3) {
              cat.realPages.push(cat.startpage)
              cat.realPages.push(cat.startpage + 2)
              cat.realPages.push(cat.startpage + 4)
            }
          } else {
            cat.realPages.push(cat.startpage)
          }
          cat.layouts = []
          categories.push(cat)
        }
        var thisCat = categories[getIndexOfObjectWithID(categories, results[i].id)]
        if (!arrayHasObjectWithID(thisCat.layouts, results[i].layouts_id)) { // layout must be created
          var layout = {}
          layout.id = results[i].layouts_id
          layout.name = results[i].layoutName
          layout.symbol = results[i].layoutSymbol
          layout.positions = []
          thisCat.layouts.push(layout)
        }
        var thisLayout = thisCat.layouts[getIndexOfObjectWithID(thisCat.layouts, results[i].layouts_id)]
        var position = {}
        position.id = results[i].position_id
        position.width = results[i].width
        position.height = results[i].height
        position.possibleType = results[i].possible_type
        position.image = null
        thisLayout.positions.push(position)
      }
      callback(null, categories)
    }
  })
}
function arrayHasObjectWithID (array, id) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return true
    }
  }
  return false
}
function getIndexOfObjectWithID (array, id) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i
    }
  }
  return -1
}
function getBackgroundImage (page, callback) {
  var self = this
  self.connection.query({sql: 'SELECT background FROM layout_backgrounds WHERE page=' + page, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0].background)
    }
  })
}
function getLayoutImagesByActionPage (actionid, page, callback) {
  var self = this
  self.connection.query({sql: 'SELECT poa.position_id AS id, poa.position_name AS name, poa.height, poa.width, poa.x, poa.y, poa.spin,poa.possible_type as possible_type, iop.value, iop.type, poa.layouts_id, l.name AS layout_name, l.symbol AS layout_symbol FROM layouts l, positions_on_actions poa LEFT JOIN objects_on_positions iop ON poa.action_has_layouts_id=iop.actions_has_layouts_id AND iop.positions_id=poa.position_id WHERE l.id=poa.layouts_id and poa.actions_id=' + actionid + ' and poa.page=' + page, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      var layout = {}
      layout.id = results[0].layouts_id
      layout.name = results[0].layout_name
      layout.symbol = results[0].layout_symbol
      layout.positions = []
      for (var i = 0; i < results.length; i++) {
        var position = {}
        position.id = results[i].id
        position.name = results[i].name
        position.height = results[i].height
        position.width = results[i].width
        position.value = results[i].value
        position.type = results[i].type
        position.possibleType = results[i].possible_type
        position.x = results[i].x
        position.y = results[i].y
        position.spin = results[i].spin
        position.action = '/bookimages/upload/' + actionid + '/' + page + '/' + results[i].id
        layout.positions.push(position)
      }
      callback(null, layout)
    }
  })
}
function getPositionImage (actionid, positionid, page, callback) {
  var self = this
  self.connection.query({sql: 'SELECT iop.value FROM objects_on_positions iop, actions_has_layouts ahl WHERE ahl.id = iop.actions_has_layouts_id AND ahl.actions_id=' + actionid + ' AND iop.positions_id=' + positionid + ' AND ahl.page=' + page, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      if (!results || results.length < 1) {
        callback({msg: 'no results'}) // eslint-disable-line standard/no-callback-literal
      } else {
        callback(null, results[0].value)
      }
    }
  })
}
function getImage (actionid, page, positionid, callback) {
  var self = this
  self.connection.query({sql: 'SELECT iop.value FROM objects_on_positions iop, actions_has_layouts ahl WHERE ahl.id = iop.actions_has_layouts_id AND iop.positions_id=' + positionid + ' AND ahl.actions_id=' + actionid + ' AND ahl.page=' + page, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0].name)
    }
  })
}
function addImage (actionid, page, positionid, name, callback) {
  var self = this
  var sql = 'SELECT id FROM actions_has_layouts WHERE actions_id=' + actionid + ' AND page=' + page
  self.connection.query({sql: sql, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      sql = 'INSERT INTO objects_on_positions (actions_has_layouts_id, positions_id, value, type) VALUES (' + results[0].id + ',' + positionid + ',"' + name + '", "image")'
      self.connection.query({sql: sql, timeout: 60000}, function (error, results2, fields) {
        if (error) {
          callback(error)
        } else {
          callback(null, results2.insertId)
        }
      })
    }
  })
}
function saveTextOnPosition (actionid, page, positionid, text, callback) {
  var self = this
  var sql = 'SELECT id FROM actions_has_layouts WHERE actions_id=' + actionid + ' AND page=' + page
  self.connection.query({sql: sql, timeout: 60000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      sql = 'INSERT INTO objects_on_positions (actions_has_layouts_id, positions_id, value, type) VALUES (' + results[0].id + ',' + positionid + ',"' + text + '", "text") ON DUPLICATE KEY UPDATE value="' + text + '", type="text"'
      self.connection.query({sql: sql, timeout: 60000}, function (error, results2, fields) {
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
  self.connection.query({sql: 'DELETE FROM objects_on_positions WHERE value="' + name + '"', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      if (results.affectedRows === 1) {
        callback(null, true)
      } else {
        callback({msg: 'Error, deleted ' + results.affectedRows + ' rows for name ' + name}) // eslint-disable-line standard/no-callback-literal
      }
    }
  })
}
function updateBookStatus (actionid, status, callback) {
  var self = this
  self.connection.query({sql: 'UPDATE actions SET book="' + status + '" WHERE id=' + actionid, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      if (results.affectedRows === 1) {
        callback(null, true)
      } else {
        callback({msg: 'Error, could not update Book for action ' + actionid + ' to status ' + status}) // eslint-disable-line standard/no-callback-literal
      }
    }
  })
}
function getUsers (callback) {
  var self = this
  self.connection.query({sql: 'SELECT vorname, nachname, email, language, location FROM userList', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getUser (email, callback) {
  var self = this
  self.connection.query({sql: 'SELECT a.id AS action_id, u.id AS id, u.email As email, u.admin AS admin, u.password AS password, l.lang_key FROM user u  LEFT JOIN actions a ON a.user_id=u.id LEFT JOIN languages l ON l.id = u.languages_id WHERE u.email="' + email + '" AND a.active = 1 LIMIT 1', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0])
    }
  })
}
function addUser (data, callback) {
  var self = this
  self.getLanguageIDFromKey(data.register_language, function (error, languagesid) {
    if (error) {
      callback(error)
    } else {
      self.connection.query({sql: 'INSERT INTO user (vorname, nachname, email, password, languages_id) VALUES("' + data.register_vorname + '", "' + data.register_nachname + '", "' + data.register_email + '", "' + data.password + '","' + languagesid + '")', timeout: 360000}, function (error, results, fields) {
        if (error) {
          callback(error)
        } else {
          self.connection.query({sql: 'INSERT INTO actions (location, start_time, end_time, finalized, user_id, active) VALUES("' + data.register_location + '", "' + data.register_start + '", "' + data.register_stop + '", "0","' + results.insertId + '", "1")', timeout: 360000}, function (error, results2, fields) {
            if (error) {
              callback(error)
            } else {
              // insert default layouts into actions_has_layouts
              self.connection.query({sql: 'SELECT c.id, c.pages, c.start_page, chl.layouts_id FROM categories c, categories_has_layouts chl WHERE c.id=chl.categories_id', timeout: 360000}, function (error, categories, fields) {
                if (error) {
                  callback(error)
                } else {
                  var sortedCats = []
                  var ahlValues = '' // (actionid, layouts_id, page), ...
                  for (var i = 0; i < categories.length; i++) {
                    if (!arrayHasObjectWithID(sortedCats, categories[i].id)) { // unique categories
                      if (categories[i].pages === 4) {
                        sortedCats.push({
                          id: categories[i].id,
                          layouts_id: categories[i].layouts_id,
                          page: categories[i].start_page
                        })
                        sortedCats.push({
                          id: categories[i].id,
                          layouts_id: categories[i].layouts_id,
                          page: categories[i].start_page + 2
                        })
                      } else if (categories[i].pages === 6) {
                        sortedCats.push({
                          id: categories[i].id,
                          layouts_id: categories[i].layouts_id,
                          page: categories[i].start_page
                        })
                        sortedCats.push({
                          id: categories[i].id,
                          layouts_id: categories[i].layouts_id,
                          page: categories[i].start_page + 2
                        })
                        sortedCats.push({
                          id: categories[i].id,
                          layouts_id: categories[i].layouts_id,
                          page: categories[i].start_page + 4
                        })
                      } else {
                        var c = {}
                        c.id = categories[i].id
                        c.layouts_id = categories[i].layouts_id
                        c.page = categories[i].start_page
                        sortedCats.push(c)
                      }
                    }
                  }
                  for (var x = 0; x < sortedCats.length; x++) {
                    ahlValues += '(' + results2.insertId + ', ' + sortedCats[x].layouts_id + ', ' + sortedCats[x].page + '),'
                  }
                  ahlValues = ahlValues.slice(0, -1)
                  self.connection.query({sql: 'INSERT INTO actions_has_layouts (actions_id, layouts_id, page) VALUES ' + ahlValues, timeout: 360000}, function (error, results3, fields) {
                    if (error) {
                      callback(error)
                    } else {
                      callback(null, {id: results.insertId, action_id: results2.insertId, email: data.register_email, language: data.register_language})
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}
function addAdminUser (data, callback) {
  var self = this
  self.connection.query({sql: 'INSERT INTO user (vorname, nachname, email, password, languages_id, admin) VALUES("' + data.register_vorname + '", "' + data.register_nachname + '", "' + data.register_email + '", "' + data.password + '","' + data.register_language + '",1)', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, {id: results.insertId})
    }
  })
}
function updatePassword (email, password, callback) {
  var self = this
  self.connection.query({sql: 'UPDATE user SET password="' + password + '" WHERE email="' + email + '"', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      if (results.affectedRows === 1) {
        self.getUser(email, callback)
      } else {
        callback({msg: 'Error, updated ' + results.affectedRows + ' rows for email ' + email}) // eslint-disable-line standard/no-callback-literal
      }
    }
  })
}
function actionFinalize (id, callback) {
  var self = this
  self.connection.query({sql: 'UPDATE actions SET finalized=1 WHERE id=' + id, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      if (results.affectedRows === 1) {
        callback(null, true)
      } else {
        callback({msg: 'Error, updated ' + results.affectedRows + ' rows for id ' + id}) // eslint-disable-line standard/no-callback-literal
      }
    }
  })
}
function saveLayout (actionid, page, layoutid, callback) {
  var self = this
  var sql = 'UPDATE actions_has_layouts SET layouts_id=' + layoutid + ' WHERE actions_id=' + actionid + ' AND page=' + page
  self.connection.query({sql: sql, timeout: 360000}, function (error, results, fields) {
    if (error) {
      console.error(error)
      console.error(sql)
      callback(error)
    } else {
      callback(null, results.insertId)
    }
  })
}
function getActions (callback) {
  var self = this
  self.connection.query({sql: 'SELECT email, language, location, start_time, end_time, finalized, book, comment, last_change, active FROM actionList', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getActionsForUser (id, callback) {
  var self = this
  self.connection.query({sql: 'SELECT email, language, location, start_time, end_time, finalized, book, comment, last_change, active FROM actionList WHERE user_id=' + id, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getActionList (callback) {
  var self = this
  self.connection.query({sql: 'SELECT a.id, location, start_time, end_time, finalized, user_id, book, lang_key AS language FROM actions a, user u, languages l WHERE u.id=a.user_id AND l.id=u.languages_id', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getAction (id, callback) {
  var self = this
  self.connection.query({sql: 'SELECT email, language, location, start_time, end_time, finalized, book, comment, last_change, active FROM actionList WHERE active=1 AND user_id=' + id, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0])
    }
  })
}
function switchAction (userId, actionId, callback) {
  // TODO: change active Action for user to ActionID (callback->result:true|false)
}
function addAction (userId, callback) {
  // TODO: create Action for UserID (like in new User) (callback->result:newActionID)
}
function getEmailByAction (actionId, callback) {
  var self = this
  self.connection.query({sql: 'SELECT email FROM userList WHERE action_id=' + actionId, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0]['email'])
    }
  })
}
function getLanguages (callback) {
  var self = this
  self.connection.query({sql: 'SELECT lang_key AS \'key\', name FROM languages', timeout: 360000}, function (error, results, fields) {
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
function getLanguageIDFromKey (key, callback) {
  var self = this
  self.connection.query({sql: 'SELECT id FROM languages WHERE lang_key="' + key + '"', timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      if (results.length !== 1) {
        callback({msg: 'no id found for key ' + key}) // eslint-disable-line standard/no-callback-literal
      } else {
        callback(null, results[0].id)
      }
    }
  })
}
function getTranslations (callback) {
  var self = this
  self.connection.query({sql: 'SELECT language_key, string_key, translation FROM language_translations ORDER BY language_key ASC, string_key ASC', timeout: 360000}, function (error, results, fields) {
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
  if (page === 0 || page === 2 || page === 48) {
    return callback(null, [])
  } else {
    var sql = 'SELECT poa.position_id AS id, poa.width, poa.height, poa.x, poa.y, poa.spin, poa.layouts_id, poa.possible_type, iop.value, iop.type, lb.background FROM positions_on_actions poa LEFT JOIN objects_on_positions iop ON iop.actions_has_layouts_id=poa.action_has_layouts_id AND iop.positions_id=poa.position_id JOIN layout_backgrounds lb WHERE lb.page=' + page + ' AND poa.actions_id=' + actionid + ' AND poa.page=' + page
    self.connection.query({sql: sql, timeout: 360000}, function (error, results, fields) {
      if (error && error.code !== 'PROTOCOL_CONNECTION_LOST' && error.code !== 'PROTOCOL_SEQUENCE_TIMEOUT') {
        console.error(sql)
        console.error(results)
        return callback(error)
      }
      var arr = []
      if (results) {
        if (results.length < 1) {
          sql = 'SELECT lb.background, p.width, p.height, p.x, p.y, p.spin, chl.layouts_id FROM categories c, categories_has_layouts chl, layout_backgrounds lb, positions p  WHERE  c.id = chl.categories_id AND p.layouts_id = chl.layouts_id AND c.start_page <= ' + page + '  AND c.start_page + c.pages >= ' + page + ' AND lb.page =' + page
          self.connection.query({sql: sql, timeout: 360000}, function (error, results2, fields) {
            if (error && error.code !== 'PROTOCOL_CONNECTION_LOST' && error.code !== 'PROTOCOL_SEQUENCE_TIMEOUT') {
              console.error(sql)
              console.error(results2)
              return callback(error)
            }
            var selLayout = results2[0].layouts_id
            for (var i = 0; i < results2.length; i++) {
              if (selLayout === results2[i].layouts_id) {
                var info = {}
                info.id = -1
                info.width = results2[i].width
                info.height = results2[i].height
                info.x = results2[i].x
                info.y = results2[i].y
                info.spin = results2[i].spin
                info.value = ''
                info.type = 'image'
                info.background = results2[i].background
                arr.push(info)
              }
            }
            callback(null, arr)
          })
        } else {
          for (var i = 0; i < results.length; i++) {
            var info = {}
            info.id = results[i].id
            info.width = results[i].width
            info.height = results[i].height
            info.x = results[i].x
            info.y = results[i].y
            info.spin = results[i].spin
            info.value = (results[i].value) ? results[i].value : ''
            info.type = (results[i].type) ? results[i].type : ''
            info.possible_type = results[i].possible_type
            info.background = results[i].background
            arr.push(info)
          }
          callback(null, arr)
        }
      } else {
        console.error(sql)
        callback({msg: 'no results!'}) // eslint-disable-line standard/no-callback-literal
      }
    })
  }
}
function getActionPages (actionId, callback) {
  var self = this
  self.connection.query({sql: 'SELECT DISTINCT ahl.page FROM `actions_has_layouts` ahl, objects_on_positions oop WHERE oop.actions_has_layouts_id = ahl.id AND ahl.actions_id=' + actionId, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getCategoryByPage (page, callback) {
  var self = this
  self.connection.query({sql: 'SELECT id FROM `categories` WHERE start_page <= ' + page + ' AND start_page + pages > ' + page, timeout: 360000}, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getActionPagesSync (actionId) {
  var self = this
  self.connection.query({sql: 'SELECT DISTINCT ahl.page FROM `actions_has_layouts` ahl, objects_on_positions oop WHERE oop.actions_has_layouts_id = ahl.id AND ahl.actions_id=' + actionId, timeout: 360000}, function (error, results, fields) {
    if (error) {
      throw new Error(error)
    } else {
      return results
    }
  })
}
function getCategoryByPageSync (page) {
  var self = this
  self.connection.query({sql: 'SELECT id FROM `categories` WHERE start_page <= ' + page + ' AND start_page + pages > ' + page, timeout: 360000}, function (error, results, fields) {
    if (error) {
      throw new Error(error)
    } else {
      return results
    }
  })
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
