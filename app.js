/**
 * Module dependencies.
 */

var express    = require('express');
var http       = require('http');

var listParser = require('./list')
var mailer     = require('./mail')

var app = module.exports = express();
var server = http.createServer(app);
var io  = require('socket.io').listen(server);

// Configuration
var config = require('./configure');
config.configure(app, io);
var redis_client = config.createRedisClient()

// Routes
app.post('/:list_id/check/:step_id', function(req, res){
  check_step(req.params.list_id, req.params.step_id)
  res.send(200)
})

app.post('/', function(req, res){
  var list = listParser.fromJSON(req.param('list'))
  console.log(list)
  redis_client.set(list.id, JSON.stringify(list))
  var emails   = req.param('emails')
  var subject = "Start list " + list.name;
  var message = app.settings.url + '' + list.id
  mailer.send(emails, subject, message)
  res.send(list.id)
})

app.post('/list/new', function(req, res){
  var list  = listParser.parse(req.param('list'), req.param('name'))
  redis_client.set(list.id, JSON.stringify(list), function(){
    res.redirect('/' + list.id)
  })
})

app.get('/', function(req, res){
  res.render('index', {
    'title' : 'Check, Check, It'
  })
})

app.get('/:list_id', function(req, res){
  var list_id = req.params.list_id;
  redis_client.get(list_id, function(err, data){
    if(data){
      var list = JSON.parse(data);
      res.render('list', {
        'title': list.name,
        'list': list
      })
    }else{
      res.send(404)
    }
  })
})


// Websocket Stuff

function check_step(list_id, step_id) {
  redis_client.get(list_id, function(err, reply){
    if(reply){
      var list = JSON.parse(reply)
      list.checked.push(parseInt(step_id))
      redis_client.set(list_id, JSON.stringify(list))
      io.sockets.in(list_id).emit('check', step_id)
    }
  })
}

function uncheck_step(list_id, step_id) {
  redis_client.get(list_id, function(err, reply){
    if(reply){
      var list = JSON.parse(reply)
      list.checked.splice(parseInt(step_id), 1)
      redis_client.set(list_id, JSON.stringify(list))
      io.sockets.in(list_id).emit('uncheck', step_id)
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

  socket.on('uncheck', function(data) {
    console.log(data.list_id, data.step_id)
    uncheck_step(data.list_id, data.step_id)
  })
})

server.listen(process.env.PORT);
console.log("Express server listening on port %d in %s mode", process.env.PORT, app.settings.env);
