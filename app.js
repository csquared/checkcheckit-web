
/**
 * Module dependencies.
 */

var express = require('express');
var mailer  = require('./mail');

var app = module.exports = express.createServer();

var io  = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.logger());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

var lists = [];

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  process.env.PORT = process.env.PORT || 3333;
  checkcheckit_url = "http://192.168.1.144:" + process.env.PORT + '/'
});

app.configure('production', function(){
  app.use(express.errorHandler());
  checkcheckit_url = 'http://checkcheckit.herokuapp.com/'
});

app.get('/:list_id', function(req, res){
  var list_id = req.params.list_id
  var list = lists[list_id]
  if(list){
    res.render('list', {
      'title': list.name,
      'list': list,
      'list_id': list_id,
    })
  }else{
    res.send(404)
  }
})
// Routes

app.post('/', function(req, res){
  var i = lists.length + 1;
  var list = req.param('list')
  var emails = req.param('emails')
  console.log(list)
  console.log(emails)
  console.log(i)

  //TODO: store not in memory
  lists[i] = list
  list.sockets = []
  list.current_step = 0

  var subject = "Start list " + list.name;
  var message = checkcheckit_url + '' + i
  mailer.send(emails, subject, message)

  res.json(i)
})

io.sockets.on('connection', function(socket) {
  socket.on('register', function(data) {
    console.log("register", data.list_id)
    lists[parseInt(data.list_id)].sockets.push(socket)
  })

  socket.on('check', function(data) {
    console.log(data.list_id, data.step_id)
    var list = lists[parseInt(data.list_id)]
    list.current_step = data.step_id
    list.sockets.forEach(function(socket){
      socket.emit('check', data.step_id)
    })
  })
})

app.listen(process.env.PORT);
console.log("Express server listening on port %d in %s mode", process.env.PORT, app.settings.env);
