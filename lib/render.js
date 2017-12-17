var fs = require('fs')
var ejs = require('ejs')

 var renderHTML = function (message){
   var template = fs.readFileSync('template/message.ejs', 'utf8')
   var html = ejs.render(template, message)
   return html
}

exports.renderHTML = renderHTML
