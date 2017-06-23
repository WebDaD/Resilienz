// TODO:
// 1. Ask for Username https://www.npmjs.com/package/readline-sync
// 2. Ask for password
// 3. Repeat Passwort
// 4. Ask if Admin
// 5. if no admin, ask details for action
// 6. ask language
// 7. Hash password md5+bcrypt  bcrypt.hash(dataset.register_password + self.secret, self.salt, callback) https://www.npmjs.com/package/md5
// 8. use code from lib/login to hash password
// 9. use lib/database to addUser into db
// 10. return OK or Error

/*
SECRET:
config

SALT:
var saltfilecontent = fs.readFileSync(self.saltfile)
if (!saltfilecontent) {
  self.salt = self.bcrypt.genSaltSync(self.saltRounds)
  fs.writeFileSync(self.saltfile, self.salt)
} else {
  self.salt = saltfilecontent
}
*/
