function renderSelfMsg(message){
  var $msg = $('<div class="message-item"><div class="message my-message"><div class="text">'+message.text+'</div></div></div>')
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
  var infoElement = $("<div class='info promtInfo'>Room changed</div>")
  $('#messages').append(infoElement)
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
