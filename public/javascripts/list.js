function check_step(step){
  $('#' + step).attr('checked', true).attr('disabled', true)
  $('label[for=' + step +']').addClass('done').addClass('text-success')
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

  //get up to speed
  var checked_steps = JSON.parse($('#list').attr('data-checked'))
  $.each(checked_steps, function(i, step) {
    check_step(step)
  })

  //attach listeners
  $('input[type=checkbox]').change(function(event){
    var step_id = $(this).attr('id')
    socket.emit('check', {'list_id':list_id, 'step_id':step_id})
  })
})

