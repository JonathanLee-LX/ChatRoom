//通过一个socket对象来初始化一个Chat对象
var Chat  = function(socket){
  this.socket = socket
}

//发送信息给服务器
Chat.prototype.sendMessage = function (message){
  this.socket.emit('message', message)
}

//变换房间事件
Chat.prototype.changeRoom = function (room){
   this.socket.emit('join', {
     newRoom: room
   })
}

//处理输入的命令
Chat.prototype.processCommand = function (command){
  var words = command.split(' ')
  var command = words[0].substring(1, words[0].length).toLowerCase()
  var message = false
  console.log(command)

  switch(command){
    case 'join':
      words.shift()
      var room = words.join(' ')
      this.changeRoom(room)
      break
    case 'nick':
      words.shift()
      var name = words.join(' ')
      this.socket.emit('nameAttempt', name)
      break
    default:
      message = 'Unrecongnized command'
      break
  }
  return message
}
