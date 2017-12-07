const Canvas = require('canvas')
const Botkit = require('botkit')
const fs = require('fs')

var canvas_saver = require('./canvas_saver.js')

if (!process.env.token) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

const controller = Botkit.slackbot({
  debug: false
})

controller.spawn({
  token: process.env.token
}).startRTM(function (err) {
  if (err) {
    throw new Error(err)
  }
})

controller.hears('test', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
  bot.reply(message, "test!!")
})

controller.hears(['create .*'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
  var text = message.text.split(' ')
  var name = text[1]
  
  var color = text[2] && text[2].match(/#?([0-9a-f]{3,6})/i) ? text[2].match(/#?([0-9a-f]{3,6})/i)[1] : '#000'
  var fontFamily = text[3] ? text[3] : 'YuGothic'

  var matches = name.match(/(.{1,2})(.*)/i)
  var name_n = matches ? matches[1] + '\n' + matches[2] : name
  var filename = "./dist/" + name + ".png"

  const canvas = new Canvas(128, 128)
  const ctx = canvas.getContext('2d')

  ctx.font = 'bold 60px ' + fontFamily
  ctx.textAlign = 'center'
  ctx.fillStyle = '#' + color
  ctx.fillText(name_n, 64, 56)

  canvas_saver.save(canvas, filename, function () {
    const messageObj = {
      file: fs.createReadStream(filename),
      filename: name + '.png',
      title: name,
      channels: message.channel
    }

    bot.api.files.upload(messageObj, function (err, res) {
      if (err) console.log(err)
    })
  })

})
