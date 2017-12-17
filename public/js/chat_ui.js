
function processUserInput(chatApp, socket){
  //封装一个待发送的消息对象
  var message = {
    nickName: user.nickName,
    text: $('#send-message').val(),
    room: user.room,
    time: (new Date()).toLocaleTimeString()
  }
  if((message.text).charAt(0) == '/'){
    var systemMessage = chatApp.processCommand(message.text)
    if(systemMessage){
      $('#messages').append( $('<div class="info erroInfo" ></div>').html('<i>' + systemMessage +'</i>'))
    }
  }else{
    chatApp.sendMessage(message)
    // 把发送的信息显示在自己的客户端上
     renderSelfMsg(message)
  }
  $("#send-message").val('')
}

//user是用户对象，有nickName和
var user ={}

$(document).ready(function () {
  //获取客户端的socket对象
  var socket = io.connect()
  var chatApp = new Chat(socket)
  //监听更名事件
  socket.on('nameResult', function (result){
    var message,infoElement
    if(result.success){
      //服务器返回数据，更名成功
      message = "You are now known as \""+result.nickName+"\"."
      //设置user的nickName属性
      user.nickName= result.nickName
      infoElement = $("<div class='info successInfo'>"+message+"</div>")
    }else{
      //更名失败
      message = result.message
      infoElement = $("<div class='info erroInfo'>"+message+"</div>")
    }
    //将改名结果显示在messages中
    /**待加强显示功能**/
    $('#messages').append(infoElement)
  })

  socket.on('joinResult', function (result){
    user.room = result.room
    $('#current-room').text(result.room)
    //将新房间节点插入到#room-list的第一个位置
    $("#room-list").prepend( $('<div ></div>').html('<i>' + result.room +'</i>'))
    //将房间变化的情况显示在messages中
    renderSystemMsg(result)
  })

  // 接收服务器发射的message事件
  socket.on('message', function (message){
      // 渲染接收到的别人的message对象
      renderOtherMsg(message)
  })
  //接收服务器发射的通知性消息
  socket.on('rename-message', function (message){
    renderRenameMsg(message)
  })

  socket.on('rooms', function (rooms){
    $('#room-list').empty()
    for(var room in rooms){
      room = room.substring(1, room.length)
      if(room != ''){
        $('#room-list').append($('<div></div>').text(room))
      }
    }
    $('#room-list div').click(function(){
      chatApp.processCommand('/join '+$(this).text())
      $('#send-message').focus()
    })
  })

  setInterval(function(){
    socket.emit('rooms')
  }, 1000)

  $('#send-message').focus()
  $('#send-form').submit(function (e){
    if(!$('#send-message').val()){
      return false
    }
    processUserInput(chatApp, socket)
    return false
  })

})


function renderSelfMsg(message){
  var $myMsg = $('<div class="message-item"><div class="message my-message"><div class="text">'+message.text+'</div></div></div>')
  $('#messages').append($myMsg)
  $('#messages').scrollTop($('#messages').prop('scrollHeight'))
}

function renderOtherMsg(message) {
  var newMsgEle  =
              $('<div class="message-item"><div class="message other-message"><div class="nickName">'+message.nickName+' '+message.time+'</div><div class="text">'+message.text+'</div></div>')
  $("#messages").append(newMsgEle)
  $('#messages').scrollTop($('#messages').prop('scrollHeight'))
}

function renderSystemMsg(message) {
  var infoElement = $('<div class="info promtInfo">has joined '+message.room+'</div>')
  $('#messages').append(infoElement)
  $('#messages').scrollTop($('#messages').prop('scrollHeight'))
}

function renderInfoMsg(message){
  var newInfoMsgEle =
  $('<div class=info promtInfo><span class="nickName">'+message.nickName+':</span><span class="text">'+message.text+'</span></div>')
  $("#messages").append(newInfoMsgEle)
  $('#messages').scrollTop($('#messages').prop('scrollHeight'))
}

function renderRenameMsg(message) {
  var msgEle = $('<div class=info promtInfo><span class="text">'+message.text+'</span></div>')
  $("#messages").append(msgEle)
  $('#messages').scrollTop($('#messages').prop('scrollHeight'))
}
