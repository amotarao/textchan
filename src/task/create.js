const canvas = require('../canvas')

const task = (bot, message) => {

  let setting = {
    text: '',
    color: '#000',
    fontFamily: 'YuGothic'
  }

  let args = message.match[1]
  let reg = /\s+(["“”][^"“”]+["“”]|[^ ]+)/g
  let arg, i = 0

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

  canvas(setting).then( (fileObj) => {
    let messageObj = fileObj
    messageObj.channels = message.channel

    bot.api.files.upload(messageObj, (err, res) => {
      if (err) console.log(err)
    })
  })
}

module.exports = task
