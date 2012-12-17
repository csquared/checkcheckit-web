
/**
 * Module dependencies.
 */

var express = require('express');
var crypto  = require('crypto');
var mailer  = require('./mail');

var app = module.exports = express.createServer();
var io  = require('socket.io').listen(app);
var redis = require('redis');

// Configuration
require('./configure').configure(app, io);

if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  redis = redis.createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);
} else {
  redis = redis.createClient();
}

redis.on("error", function (err) {
  console.log("Redis Error " + err);
});


// Routes
//
app.get('/:list_id', function(req, res){
  var list_id = req.params.list_id
  redis.get(list_id, function(err, data){
    if(data){
      var list = JSON.parse(data)
      res.render('list', {
        'title': list.name,
        'list': list,
        'list_id': list_id,
      })
    }else{
      res.send(404)
    }
  })
})

app.post('/:list_id/check/:step_id', function(req, res){
  check_step(req.params.list_id, req.params.step_id)
  res.send(200)
})

var hexdigest = function(string){
  return crypto.createHash('sha1').update(string).digest('hex')
}

app.post('/', function(req, res){
  console.log(req.param('list'))
  var list     = req.param('list')
  var emails   = req.param('emails')
  var list_id  = hexdigest(list.toString() + new Date().toString())
  list.checked = []
  console.log(list)
  console.log(emails)
  console.log(list_id)

  //TODO: store not in memory
  redis.set(list_id, JSON.stringify(list))

  var subject = "Start list " + list.name;
  var message = app.settings.url + '' + list_id
  mailer.send(emails, subject, message)

  res.json(list_id)
})

function check_step(list_id, step_id) {
  redis.get(list_id, function(err, reply){
    if(reply){
      list = JSON.parse(reply)
      list.checked.push(parseInt(step_id))
      redis.set(list_id, JSON.stringify(list))
      io.sockets.in(list_id).emit('check', step_id)
    }
  })
}

io.sockets.on('connection', function(socket) {
  socket.on('register', function(data) {
    console.log("register", data.list_id)
    socket.join(data.list_id)
  })

  socket.on('check', function(data) {
    console.log(data.list_id, data.step_id)
    check_step(data.list_id, data.step_id)
  })
})

app.listen(process.env.PORT);
console.log("Express server listening on port %d in %s mode", process.env.PORT, app.settings.env);
