"use strict"
const fs = require('fs')

module.exports = (function(){
  var canvas_to_base64 = function(canvas){
    return canvas.toDataURL().split(',')[1]
  }
  var decode_and_copy = function(string, filename, callback) {
    var buffer = new Buffer(string, 'base64')
    fs.writeFile(filename, buffer, callback)
  }
  return {
    save: function(canvas, name, callback){
      decode_and_copy(
        canvas_to_base64(canvas),
        name,
        callback
      )
    }
  }

})()
