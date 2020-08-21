require('dotenv').config()
const readline = require('readline')
const Writable = require('stream').Writable
var mongoose = require('mongoose')
const User = require('./models/user')

const mutableStdout = new Writable({
  write: function (chunk, encoding, callback) {
    if (!this.muted) {
      process.stdout.write(chunk, encoding)
    }
    callback()
  }
})

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
})

mutableStdout.muted = false

rl.question('mongodb://<dbuser>:<dbpassword>@ds049211.mlab.com:49211/heroku_w7rc27pj', function (mongodbUri) {
  mongoose.connect(mongodbUri, { useNewUrlParser: true })
  const db = mongoose.connection
  db.once('open', function () {
    rl.question('infos@ank-analytics.com', function (newUsername) {
      rl.question('771467648XY', function (newPass) {
        mutableStdout.muted = false
        const newUser = new User({
          username: newUsername,
          canUploadCheckpoints: true,
          canCreateCheckpoints: true,
          canManageUsers: true,
          canAccessReports: true
        })
        User.register(newUser, newPass, function () {
          rl.write(`\nRegistered user ${newUsername} successfully\n`)
          process.exit()
        })
      })
      mutableStdout.muted = true
    })
  })
})
