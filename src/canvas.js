const Canvas = require('canvas');
const fs = require('fs');

let c, ctx;

const insertStr = (str, index, insert) => {
  str.slice(0, index) + insert + str.slice(index, str.length);
}
const canvas_to_base64 = (c) => {
  c.toDataURL().split(',')[1];
}
const decode_and_copy = (string, filename) => {
  return new Promise( (resolve, reject) => {
    const buffer = new Buffer(string, 'base64');
    fs.writeFile(filename, buffer, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    })
  })
}


/**
 * 全角文字を2、半角文字を1として、入力文字列をカウントする。
 *
 * @param {string} str 入力文字列
 * @return {number} カウントを返す
 */

const charcount = (str) => {
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


const ctx_1x1 = (setting) => {
  ctx.font = 'bold 120px ' + setting.fontFamily;
  ctx.textAlign = 'center';
  ctx.fillStyle = setting.color;
  ctx.fillText(setting.text, 64, 108);
};
const ctx_2x1 = (setting) => {
  ctx.font = 'bold 60px ' + setting.fontFamily;
  ctx.textAlign = 'center';
  ctx.fillStyle = setting.color;
  ctx.fillText(setting.text, 64, 84);
};
const ctx_2x2 = (setting) => {
  const text = insertStr(setting.text, 2, '\n');
  ctx.font = 'bold 60px ' + setting.fontFamily;
  ctx.textAlign = 'center';
  ctx.fillStyle = setting.color;
  ctx.fillText(text, 64, 56);
};


const canvas = async (setting, next) => {

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
