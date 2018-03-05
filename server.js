//创建一个HTTP服务器，并将Socket.IO关联到这个HTTP服务器上，使他们共享一个
//  TCP/IP端口

var http = require('http')
var fs = require('fs')
var path = require('path')
var mime = require('mime')

//缓存对象
var cache = {}
//监听端口
var port = 9000

//发送404错误
function send404(response) {
  response.writeHead(404, {'Content-Type':'text/palin'})
  response.write('Error 404: resource not found.')
  response.end()
}

//发送指定文件
function sendFile(response, filePath, fileContents){
  response.writeHead(200,{'Content-Type': mime.getType(path.basename(filePath))})
  response.end(fileContents)
}
/*
//提供静态文件服务
function serveStatic(response, cache, absPath){
  if(cache[absPath]){
    sendFile(response, absPath, cache[absPath])
  }else{
    fs.exists(absPath, function(exists){
      if(exists){
        fs.readFile(absPath, function(err, data){
          if(err){
            console.log('4041')
            send404(response)
          }else{
            //将路径为absPath的文件的内容缓存起来,可以避免下次的readFile()
            cache[absPath] = data
            sendFile(response, absPath, data)
          }
        })
      }else{
        console.log('4042')
        send404(response)
      }
    })

  }
}
*/

function serveStatic(response, cache, absPath){
  var exists
  if(cache[absPath]){
    sendFile(response, absPath, cache[absPath])
  }else{
    exists = fs.existsSync(absPath)
    if(exists){
      fs.readFile(absPath,function(err, data){
        if(err){
          //读取文件发生错误，这里使用404暂时代替
          send404(response)
        }else{
          //将路径为absPath的文件的内容缓存起来,可以避免下次的readFile()
          cache[absPath] = data
          sendFile(response, absPath, data)
        }
      })
    }else{
      send404(response)
    }
  }
}




//创建http服务器
var server = http.createServer(function(request, response){
  var filePath = false
  if(request.url === '/'){
    filePath = 'public/index.html'
  }else{
    filePath = 'public' + request.url
  }
  var absPath = './' + filePath
  serveStatic(response, cache, absPath)
})

server.listen(port, function (){
  console.log("has running on port: "+port)
})

//加载一个定制的Node模块，它提供的逻辑是用来处理基于Socket.IO的服务器端的聊天功能
var chatServer = require('./lib/chat_server.js')
//使chatServer和HTTP服务器共享一个TCP/IP端口
chatServer.listen(server)
