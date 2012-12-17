function check_step(step){
  $('#' + step).attr('checked', true).attr('disabled', true)
  $('label[for=' + step +']').addClass('done')
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
  var current_step = parseInt($('#list').attr('data-current-step'))
  for(step=0; step < current_step + 1; step++){
    check_step(step)
  }

  //attach listeners
  $('input[type=checkbox]').change(function(event){
    var step_id = $(this).attr('id')
    socket.emit('check', {'list_id':list_id, 'step_id':step_id})
  })
})

