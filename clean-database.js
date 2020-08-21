/*
  Deletes expired checkpoints. Should be scheduled to run once per day.
*/
require('dotenv').config()
var mongoose = require('mongoose')
const readline = require('readline')

const Checkpoint = require('./models/checkpoint')

const oneDay = 1000 * 60 * 60 * 24
const estimatedDiagnosisDelay = Number(process.env['ESTIMATED_DX_DELAY_DAYS']) * oneDay
const mongoDbUri = process.env.MONGODB_URI || 'mongodb://<dbuser>:<dbpassword>@ds049211.mlab.com:49211/heroku_w7rc27pj/checkpoints?retryWrites=false'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

rl.write('Cleaning database...\n')

mongoose.connect(mongoDbUri, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', function () {
  const startSearchTimestamp = Date.now() - estimatedDiagnosisDelay
  Checkpoint.deleteMany({ timestamp: { $lt: startSearchTimestamp } }, function (err) {
    if (err) {
      rl.write(String(err))
    } else {
      rl.write('\nExpired checkpoints were successfully deleted.\n\n')
    }
    process.exit()
  })
})
