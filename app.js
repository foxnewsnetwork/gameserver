
/**
 * Module dependencies.
 */

// express web frame work
var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// socket.io 
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

// app.get('/', routes.index);
// app.get('/faggot', routes.faggot);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Socket io stuff
app.get('/', function(req, res){
	 // res.sendfile(__dirname + '/index.html');
	 res.render("index.jade", { title : "beta faggot losers" });
});

io.sockets.on('connection', function(socket){
	socket.emit('news', "faggot" );
});
