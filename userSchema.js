const mongoogse = require('mongoose')

const user = mongoogse.Schema({
  username: {
    type: String,
    required: true,
  },
  hashedpwd: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoogse.model('user', user)
