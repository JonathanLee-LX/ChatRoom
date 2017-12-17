var fs = require('fs')
var ejs = require('ejs')

 var render = function (message){
   var template = fs.readFileSync('template/message.ejs', 'utf8')

   var html = ejs.render(template, message)
}

exports.render = render
