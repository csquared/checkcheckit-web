
/**
 * Module dependencies.
 */

var express = require('express');
var mailer  = require('./mail');

var app = module.exports = express.createServer();

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
  var list = lists[req.params.list_id]
  if(list){
    res.render('list', {
      'title': list.name,
      'list': list
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

  //TODO: store not in memory
  lists[i] = list

  var subject = "Start list " + list.name;
  var message = checkcheckit_url + '' + i
  mailer.send(emails, subject, message)

  res.send(200, i)
})

app.listen(process.env.PORT);
console.log("Express server listening on port %d in %s mode", process.env.PORT, app.settings.env);
