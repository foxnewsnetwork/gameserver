
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

app.get('/', function(req, res){
	 // res.sendfile(__dirname + '/index.html');
	 res.render("index.jade", { title : "beta faggot losers" });
});

/****************************
* Socket IO Response Server *
****************************/
// Initialize the socket connection
io.sockets.on('connection', function(socket){

	/****************************
	* Player Server Response        *
	****************************/
	// player login
	socket.on( "player login up", function(playerinfo){ 
		// TODO: handle and process playerinfo
		var result;
		socket.emit( "player login down", result );
	} );
	
	
	/****************************
	* Shop Server Response           *
	****************************/
	// open shop
	socket.on( "open shop up", function(metadata){
		// TODO: handle the api calls for this
		var items;
		socket.emit( "open shop down", items );
	} );
	
	// purchase item
	socket.on( "purchase item up", function(data){
		// TODO: write this
		var result;
		socket.emit( "purchase item down", result )
	} );
	
	
	/****************************
	* Channel Server Response       *
	****************************/
	// join channel
	socket.on( "join channel up", function( data ){ 
		// TODO: write this
		var result;
		socket.emit( "join channel down", result );
	});
	
	// chat
	socket.on( "chat up", function(data){ 
		// TODO: write this
		var event;
		socket.emit( "chat down", event );
	});
	
	
	/****************************
	* Game Server Response          *
	****************************/
	// join game
	socket.on( "join game up", function( data ){
		// TODO: write this
		var result;
		socket.emit( "join game down", result );
	} );
	
	// game event
	socket.on( "game event up", function(data){ 
		// TODO: write this
		var event;
		socket.emit( "game event down", event );
	});
	
	// sync
	socket.on( "sync up", function( syncRatio ){ 
		// TODO: write this
		var syncValue;
		socket.emit( "sync down", syncValue );	
	});

});
