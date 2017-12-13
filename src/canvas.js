const Canvas = require('canvas')
const fs = require('fs')

let c, ctx

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


/**
 * 全角文字を2、半角文字を1として、入力文字列をカウントする。
 *
 * @param {string} str 入力文字列
 * @return {number} カウントを返す
 */

var charcount = (str) => {
  len = 0;
  str = escape(str);
  for (i = 0; i < str.length; i++, len++) {
    if (str.charAt(i) == "%") {
      if (str.charAt(++i) == "u") {
        i += 3;
        len++;
      }
      i++;
    }
  }
  return len;
};


var ctx_1x1 = (setting) => {
  ctx.font = 'bold 120px ' + setting.fontFamily;
  ctx.textAlign = 'center';
  ctx.fillStyle = setting.color;
  ctx.fillText(setting.text, 64, 108);
};
var ctx_2x1 = (setting) => {
  ctx.font = 'bold 60px ' + setting.fontFamily;
  ctx.textAlign = 'center';
  ctx.fillStyle = setting.color;
  ctx.fillText(setting.text, 64, 84);
};
var ctx_2x2 = (setting) => {
  var text = insertStr(setting.text, 2, '\n');
  ctx.font = 'bold 60px ' + setting.fontFamily;
  ctx.textAlign = 'center';
  ctx.fillStyle = setting.color;
  ctx.fillText(text, 64, 56);
};


async function canvas(setting, next) {

  setting = setting || {
    text: 'えもじ！',
    color: '#000',
    fontFamily: 'YuGothic'
  }

  c = new Canvas(128, 128)
  ctx = c.getContext('2d')

  switch (charcount(setting.text)) {
    case 1:
    case 2:
      ctx_1x1(setting);
      break;
    case 3:
    case 4:
      ctx_2x1(setting);
      break;
    default:
      ctx_2x2(setting);
  }

  const filename = './dist/' + setting.text + '.png'

  await decode_and_copy(canvas_to_base64(c), filename)

  const fileObj = {
    file: fs.createReadStream(filename),
    filename: setting.text + '.png',
    title: setting.text
  }

  return fileObj
}

module.exports = canvas
