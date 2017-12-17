
$(function () {
  //连接服务器的socket对象
  $('.message').focus()
  io.connect()
  var socket = new io()
    $("form").submit(function (e) {
      var val = $('.message').val()
      $('.message').val('');
      socket.emit('message', val)
      $('.content').append("<p>"+val+"</p>")
      return false
    })
  });
