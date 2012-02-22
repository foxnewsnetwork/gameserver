/**
 * Module dependencies.
 */
 
// http usage
var http = require('http');

// querystring for post formatting
var querystring = require("querystring");

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
	// res.render("index.jade", { title : "beta faggot losers" });
	
	res.render("index.jade", { title: "stuff", content: "nothing yet" } );
});

/****************************
* Useful Constants                     *
*****************************/
var gameToken = 'cf242dcaf5d0a4a0b0e2949e804dcebf';
var shopSite = 'gamertiser.com';
var shopPath = '/api/v1/product.json?token=';
var shopPort = 80;


/****************************
* Socket IO Response Server *
****************************/
// Initialize the socket connection
io.sockets.on('connection', function(socket){
	console.log('we are connected');
	socket.emit( 'connection', socket.id );
	
	/****************************
	* Player Server Response        *
	****************************/
	// player login
	socket.on( "player login up", function(data){ 
		var playerPath = "/api/v1/players";
		var postData = querystring.stringify({
			'gameToken': gameToken,
			'username': data['username'],
			'email': data['email'],
			'password': data['password'] // mike@mxhi
		});
		
		// TODO: handle and process playerinfo
		var options = { 
			host: shopSite,
			port: shopPort,
			path: playerPath,
			method: "POST",
			header: { 
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length
			}
		};
		
		var request = http.request( options, function(response){
			console.log( "status: " + response.statusCode );
			console.log( "headers: " + JSON.stringify(response.headers) );
			response.on("data", function(chunk){ 
				console.log( "body: " + chunk );
				output = { 'sessionId': data['sessionId'], 'playerToken': JSON.parse(chunk)['playerToken'] };
				socket.emit( "player login down", output );
			});	
		});
		
		request.write( postData );
		request.end();
	} );
	
	
	/****************************
	* Shop Server Response           *
	****************************/
	// open shop
	socket.on( "open shop up", function(data){
		// TODO: handle the api calls for this
		// Step 1: declaring my constants
		
		
		// Step 2: seeing we can't hit the outside world
		var options = { 
			host: shopSite,
			port: shopPort,
			path: shopPath + gameToken
		};
		var output;
		var request = http.get( options, function(response){ 
			console.log( "status: " + response.statusCode );
			console.log( "headers: " + JSON.stringify(response.headers) );
			response.on("data", function(chunk){ 
				console.log( "body: " + chunk );
				output = { 'sessionId': data['sessionId'], 'items': JSON.parse(chunk) };
				socket.emit( "open shop down", output );
			});
		});	
	});
	
	// purchase item
	socket.on( "purchase item up", function(data){
		// TODO: write this
		var shopPath = '/api/v1/products/' + data['productId'];

		var postData = querystring.stringify({
			'gameToken': gameToken ,
			'playerToken': data['playerToken'] ,
		});
				
		var options = { 
			host: shopSite ,
			port: shopPort ,
			path: shopPath ,
			method: "POST" ,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length
			}
		};
		
		var request = http.request( options, function(response){
			console.log( "status: " + response.statusCode );
			console.log( "headers: " + JSON.stringify(response.headers) );
			response.on("data", function(chunk){ 
				console.log( "body: " + chunk );
				output = { 'sessionId': data['sessionId'], 'items': JSON.parse(chunk) };
				socket.emit( "purchase item down", output );
			});
		});
		
		request.write( postData );
		request.end();
	});
	
	
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
		// data contains: { sessionId: #,  }
		var middle = { 
			'sessionId': data['sessionId'],
			'message': data['message']
		};
		console.log( "middle: ");
		console.log( middle );
		socket.broadcast.emit( "chat down", middle );
		socket.emit( "chat down", middle );
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


