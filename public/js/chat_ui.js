function divEscapedContentElement(message){
  //将message转化为正常字符，避免message中包含script标签的攻击
  return $('<div></div>').text(message)
}

function divSystemContentElement(message){
  return $('<div></div>').html('<i>' + message +'</i>')
}

function processUserInput(chatApp, socket){
  //获取用户信息，房间号和消息内容，打包成message对象发送
  var message = {}
    message.text = $('#send-message').val()
    message.room = $('#room').text()
    message.nickName = user.nickName
  //系统信息
  var systemMessage

  //判断是否是命令
  if(message.chatAt(0) == '/'){
    //处理命令信息，返回一个系统信息
    systemMessage = chatApp.processCommand(message)
    if(systemMessage){
      $('#messages').append(divSystemContentElement(systemMessage))
    }
  }else {
    chatApp.sendMessage(message)
    $('#messages').append(divEsapedContentElement(message))
    $('#messages').scrollTop($('#messages').prop('scrollHeight'))
  }
  $('#send-message').val('')
}

//获取客户端的socket对象
var socket = io.connect()
console.log(socket)

$(document).ready(function () {
  var chatApp = new Chat(socket)
  var user = {}

  socket.on('nameResult', function (result){
    var message
    if(result.success){
      message = "You are now known as"+result.name+'.'
      user.nickName = result.name
    }else{
      message = result.message
    }
    $('#messages').append(divSystemContentElement(message))
  })

  socket.on('joinResult', function (result){
    $('#room').text(result.room)
    $('#message').append(divSystemContentElement('Room changed.'))
  })

  socket.on('message', function (message){
    var newElement = $('<div></div>').text(message.text)
  })

  socket.on('rooms', function (rooms){
    $('#room-list').empty()

    for(var room in rooms){
      room = room.substring(1, room.length)
      if(room != ''){
        $('#room-list').append(divEsapedContentElement)
      }
    }
    $('#room-list div').click(function(){
      chatApp.processCommand('/join '+$(this).text())
      $('send-message').focus()
    })
  })

  setInterval(function(){
    socket.emit('rooms')
  }, 1000)

  $('#send-message').focus()

  $('#send-form').submit(function (e){
    processUserInput(chatApp, socket)
    return false
  })

})
