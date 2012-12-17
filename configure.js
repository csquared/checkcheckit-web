express = require('express');

exports.configure = function(app) {
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.logger());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    process.env.PORT = process.env.PORT || 3333;
    app.settings.url = "http://192.168.1.144:" + process.env.PORT + '/'
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
    app.settings.url = 'http://checkcheckit.herokuapp.com/'
  });
}
