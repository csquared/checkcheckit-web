var express = require('express');
var redis = require('redis');

exports.configure = function(app, io, redis) {
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

  var RedisStore = require('socket.io/lib/stores/redis');

  io.configure('production', function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);

    io.set('store', new RedisStore({
      redis    : redis
    , redisPub : exports.createRedisClient()
    , redisSub : exports.createRedisClient()
    , redisClient : exports.createRedisClient()
    }));
  });

  io.configure('development', function(){
    io.set('store', new RedisStore({
      redisPub : exports.createRedisClient()
    , redisSub : exports.createRedisClient()
    , redisClient : exports.createRedisClient()
    }));
  })
}

exports.createRedisClient = function(){
  var redis_client = null;

  //Setup Redis
  if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    redis_client = redis.createClient(rtg.port, rtg.hostname);
    var redis_password = rtg.auth.split(":")[1]
    redis_client.auth(redis_password);
  } else {
    redis_client = redis.createClient();
  }

  redis_client.on("error", function (err) {
    console.log("Redis Error " + err);
  });

  return redis_client
}
