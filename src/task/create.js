const canvas = require('../canvas')

const task = function (bot, message) {

  var setting = {
    text: '',
    color: '#000',
    fontFamily: 'YuGothic'
  }

  var args = message.match[1]
  var reg = /\s+(["“”][^"“”]+["“”]|[^ ]+)/g
  var arg, i = 0

  while (arg = reg.exec(args)) {
    arg = arg[1].replace(/^["“”](.*)["“”]$/, '$1')

    switch (i) {
      case 0:
        setting.text = arg
        break
      case 1:
        setting.color = arg
        break
      case 2:
        setting.fontFamily = arg
        break
    }
    i++
  }

  canvas(setting).then(function (fileObj) {
    var messageObj = fileObj
    messageObj.channels = message.channel

    bot.api.files.upload(messageObj, function (err, res) {
      if (err) console.log(err)
    })
  })
}

module.exports = task
