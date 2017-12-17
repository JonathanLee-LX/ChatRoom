var socket = require('socket.io')
var io
var guestNumber = 1 //第几个用户
var nickNames = {}  //用户昵称对象
var namesUsed = []  //曾用名的数组
var currentRoom = {} //当前的聊天室
var defaultRoom = {
  roomName: 'JonathanLee\'s Chat Room'
}

exports.listen = function(server){
  //io是监听HTTP端口的socket对象
  io = new socket(server)
//  io.set('log level', 1)

  io.on('connection', function(socket){
    console.log(socket.id+' has connected...')
    guestNumber = assginGuestName(socket, guestNumber, nickNames, namesUsed)
    joinRoom(socket, defaultRoom.roomName)
    handleMessageBroadcasting(socket)
    handleNameChangeAttempts(socket, nickNames, namesUsed)
    handleRoomJoining(socket)
  //  handleClientDisconnection(socket, nickNames, namesUsed)
  })
}

//分配用户名
function assginGuestName(socket, guestNumber, nickNames, namesUsed){
  var nickName  = 'Guest' + guestNumber
  nickNames[socket.id] = nickName
  socket.emit('nameResult', {
    success: true,
    nickName: nickName
  })
  namesUsed.push(nickName)
  return guestNumber + 1
}

//进入一个房间
  function joinRoom(socket, room){
    //加入这个房间
    socket.join(room,function(){
      console.log('has join '+room+" room")
    })

    currentRoom[socket.id] = room
    // 发射joinResult事件给客户端
    socket.emit('joinResult', {room: room})
    // socket.to(room)触发一个事件到指定的room中的用户，但不包括发送信息的用户本身
    socket.broadcast.emit('join-message', {
      text:' has joined \"' + room +'\".',
      nickName: nickNames[socket.id]
      })
    /*
// 统计当前房间在线人数
  var usersInRoom  = io.eio.clientsCount
  console.log(usersInRoom+" userRoom")
  console.log(socket.nsp.connected[socket.id])
  //console.log(socket.nsp.connected)
  if(usersInRoom.length > 1){
      var usersInRoomSummary = 'User currently in'+room+':'
      for(var index in usersInRoom){
        var userSocketId = usersInRoom[index].id
        if(userSocketId != socket.id){
          if(index > 0){
            usersInRoomSummary += ', '
          }
          usersInRoomSummary += nickNames[userSocketId]
          console.log(usersInRoomSummary)
        }
      }
      usersInRoomSummary += '.'
      socket.emit('message', {text: usersInRoomSummary})
    }
    */
}


function handleNameChangeAttempts(socket, nickNames, namesUsed){
  socket.on('nameAttempt', function(name){
    //检查name是否是以Guest开头
    if(name.indexOf('Guest') == 0){
        socket.emit('nameResult', {
          success: false,
          message: 'Name cannot begin with "Guest"',
        })
    }else {
      //查询当前已存在这个name
      if(namesUsed.indexOf(name) == -1){
        //原来的名字
        var previousName = nickNames[socket.id]
        //原来名字在nameUsed中的角标
        var previousNameIndex = namesUsed.indexOf(previousName)
        //在已用名的数组中删除以前的用户名
        delete namesUsed[previousNameIndex]
        namesUsed.push(name)
        nickNames[socket.id] = name

        socket.emit('nameResult', {
          success: true,
          nickName: name,
          message: 'Name has been changed'
        })
        //广播给所有的socket名字更改事件，除了自己本身
        socket.broadcast.emit('rename-message', {
          text: previousName+ ' is now known as ' + name +'.',
          success: true
        })

      }else{
        socket.emit('nameResult', {
          success: false,
          message: "That name is already in use"
        })
      }
    }
  })
}

function handleMessageBroadcasting(socket){
  socket.on('message', function (message) {
    console.log("has received :" + message.text+" from:"+message.room+' by'+message.nickName+' in'+message.time)
    socket.broadcast.to(currentRoom[socket.id]).emit('message', message)
  })
}

function handleRoomJoining(socket){
  socket.on('join', function (room){
    socket.leave(currentRoom[socket.id])
    joinRoom(socket, room.newRoom)
  })
}

function handleRoomLeaving(socket){
    socket.on('leave', function (room){
      //对这个房间中的用户发射某用户离开的事件
      socket.to(currentRoom[socket.id]).broadcast.emit('leave', {
        nickName: nickName,
        text: nickName+" has leaved room"
      })
    })
}

/*
function handleClientDisconnection(socket){
  socket.on('disconnect', function () {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id])
    var nickName = nickNames[socket.id]
    delete namesUsed[nameIndex]
    delete nickNames[socket.id]

    //向所有客户端发送一个某个socket离开的消息
    socket.broadcast.emit('disconnect', {
      nickName: nickName,
      text: nickName+" has disconnect.."
    })
  })
}
*/
