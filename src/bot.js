const Botkit = require('botkit')

const controller = Botkit.slackbot({
  debug: false
})

controller.spawn({
  token: process.env.token
}).startRTM( (err) => {
  if (err) {
    throw new Error(err)
  }
})

require('./controller')(controller)

module.exports = controller
