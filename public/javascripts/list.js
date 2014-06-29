function check_step(step){
  $('#' + step).attr('checked', true)
  $('label[for=' + step +']').addClass('done').addClass('text-success')
}

function uncheck_step(step){
  $('#' + step).removeAttr('checked')
  $('label[for=' + step +']').removeClass('done').removeClass('text-success')
}

$(function() {
  var socket = io.connect();
  var list_id = $('#list').attr('data-id');
  //register interest in the list
  socket.emit('register', {'list_id' : list_id})

  //setup the websocket
  socket.on('check', function(step){
    console.log("check", step)
    check_step(step)
  })

  socket.on('uncheck', function(step){
    console.log("uncheck", step)
    uncheck_step(step)
  })

  //get up to speed
  var checked_steps = JSON.parse($('#list').attr('data-checked'))
  $.each(checked_steps, function(i, step) {
    check_step(step)
  })

  //attach listeners
  $('input[type=checkbox]').change(function(event){
    var step_id = $(this).attr('id')
    if($(this).is(':checked')) {
      socket.emit('check', {'list_id':list_id, 'step_id':step_id})
    }else{
      socket.emit('uncheck', {'list_id':list_id, 'step_id':step_id})
    }
  })
})
