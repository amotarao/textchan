const Canvas = require('canvas')
const fs = require('fs')

var insertStr = function (str, index, insert) {
  return str.slice(0, index) + insert + str.slice(index, str.length);
}
var canvas_to_base64 = function (c) {
  return c.toDataURL().split(',')[1]
}
var decode_and_copy = function (string, filename) {
  return new Promise(function (resolve, reject) {
    var buffer = new Buffer(string, 'base64')
    fs.writeFile(filename, buffer, function (err) {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

async function canvas(setting, next) {

  setting = setting || {
    text: 'えもじ！',
    color: '#000',
    fontFamily: 'YuGothic'
  }

  const text_n = insertStr(setting.text, 2, '\n')
  const filename = './dist/' + setting.text + '.png'

  const c = new Canvas(128, 128)
  const ctx = c.getContext('2d')

  ctx.font = 'bold 60px ' + setting.fontFamily
  ctx.textAlign = 'center'
  ctx.fillStyle = setting.color
  ctx.fillText(text_n, 64, 56)

  await decode_and_copy(canvas_to_base64(c), filename)

  const fileObj = {
    file: fs.createReadStream(filename),
    filename: setting.text + '.png',
    title: setting.text
  }

  return fileObj
}

module.exports = canvas
