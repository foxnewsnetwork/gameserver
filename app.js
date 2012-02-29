/******************************
 * Module dependencies.                 *
 ******************************/
// http usage for external requests
var http = require('http');

// querystring for post formatting
var querystring = require("querystring");

// express web frame work
var express = require('express')
  , routes = require('./routes');
var app = module.exports = express.createServer();

// socket.io for server-client communication
var io = require('socket.io').listen(app);

// mongoose for mongodb storage
// var mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost/my_ingidio_database');

// redis for rooms and channels
/*var redis = require("redis"),
	client = redis.createClient();
*/

/*******************************
* Express Server Setup                *
********************************/
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

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

app.get('/', function(req, res){
	res.render("index.jade", { title: "stuff", content: "nothing yet" } );
});

app.get("/faggot", function(req, res){
	res.render("numbers.jade", { title: "Henry is a faggot" } );
} );
/****************************
* Useful Constants                     *
*****************************/
var gameToken = 'cf242dcaf5d0a4a0b0e2949e804dcebf';
var shopSite = 'gamertiser.com';
var shopPath = '/api/v1/product.json?token=';
var shopPort = 80;
var maxPerRoom = 4; // 0 means no limit
var maxPerChannel = 500; 


/****************************
* Redis Configuration                 *
*****************************/
/*
client.on("error", function (err) {
    console.log("Error " + err);
});
// We flush before each use
client.flushdb();
*/

/****************************
* Channel Models                           *
*****************************/
var chatchannels = function(){ 
	this.channels = {};
	this.players = {};
	this.channelCount = 0;
	this.FirstOpenChannel;
	this.NextChannelId;
	
	this.ChannelStats = function( channel ){ 
		var statData = { 
			'channelId': channel,
			'population': this.channels[channel].length,
			'people': this.channels[channel],
		};
		return statData;
	}
	
	this.GetChannel = function(player){ 
		var channel = this.players[player]['channelId'];
		return channel;
	}
	
	this.JoinChannel = function(player, channel){ 
		var aChan;
		if( this.players[player] != undefined ){ 
			this.LeaveChannel( player );
		}
		
		if(channel == undefined){
			aChan = this.FirstOpenChannel;
		}
		else{
			aChan = channel;
		}
		
		if( this.channels[aChan] == undefined )
			this.channels[aChan] = [];	
		if( this.channels[aChan].length > maxPerChannel )
			aChan = this.FirstOpenChannel;
		
		this.channels[aChan].push( player );
		this.players[player] = { 'channelId': aChan, 'number': this.channels[aChan].length-1 };
		
		if(this.channels[aChan].length == maxPerChannel){ 
			this.CreateNewChannel();
		}	
	}
	
	this.Initialize = function(){ 
		this.channels[1] = [];
		this.FirstOpenChannel = 1;
		this.NextChannelId = 2;
	}
	
	this.CreateNewChannel = function(){ 
		this.FirstOpenChannel = this.NextChannelId;
		this.channels[this.FirstOpenChannel] = [];
		this.NextChannelId += 1;
	}
	
	this.LeaveChannel = function(player){ 
		if( this.players[player] == undefined )
			return false;
		var channel = this.players[player]['channelId'];
		var number = this.players[player]['number'];
		this.channels[channel].splice( number, 1 );
		this.players[player] = undefined;
		return channel;
	}
}

var mychannels = new chatchannels();
mychannels.Initialize();


/****************************
* Room Models                               *
*****************************/
var gamerooms = function(){ 
	this.rooms = {};
	this.players = {};
	this.roomCount = 0;
	this.FirstOpenRoom;
	this.NextRoomId;
	this.startFlags = {};
	
	this.StartGame = function(room){ 
		if( this.startFlags[room] )
			return false;
		else{
			this.startFlags[room] = true;
			return true;
		}
	}
	
	this.EndGame = function(room){ 
		if( !this.startFlags[room] ){ 
			return false;
		}
		else{ 
			this.startFlags[room] = false;
			return true;
		}
	}
	
	this.RoomStats = function( room ){ 
		var statData = { 
			'roomId': room,
			'population': this.rooms[room].length,
			'people': this.rooms[room],
			'started': this.startFlags[room]
		};
		return statData;
	}
	
	this.GetRoom = function(player){ 
		var room = this.players[player]['roomId'];
		return room;
	}
	
	this.JoinRoom = function(player, room){ 
		var aRoom;
		if( this.players[player] != undefined ){ 
			this.LeaveRoom( player );
		}
		
		if(room == undefined || this.rooms[room].length < maxPerRoom)
			aRoom = this.FirstOpenRoom;
		else
			aRoom = room;
		
		if( this.rooms[aRoom] == undefined ){
			this.rooms[aRoom] = [];	
			this.startFlags[aRoom] = false;
		}
		this.rooms[aRoom].push( player );
		this.players[player] = { 'roomId': aRoom, 'number': this.rooms[aRoom].length-1 };
		console.log( "NIGGERS HERE: " + JSON.stringify( this.rooms ) );
		
		if(this.rooms[aRoom].length == maxPerRoom){ 
			this.CreateNewRoom();
		}	
	}
	
	this.Initialize = function(){ 
		this.rooms[1] = [];
		this.FirstOpenRoom = 1;
		this.NextRoomId = 2;
	}
	
	this.CreateNewRoom = function(){ 
		this.FirstOpenRoom = this.NextRoomId;
		this.rooms[this.FirstOpenRoom] = [];
		this.startFlags[this.FirstOpenRoom] = false;
		this.NextRoomId += 1;
	}
	
	this.LeaveRoom = function(player){ 
		if( this.players[player] == undefined )
			return false;
		var room = this.players[player]['roomId'];
		var number = this.players[player]['number'];
		this.rooms[room].splice( number, 1 );
		this.players[player] = undefined;
		return room;
	}
}

var myrooms = new gamerooms();
myrooms.Initialize();

/****************************
* Socket IO Response Server *
****************************/
// Initialize the socket connection
io.sockets.on('connection', function(socket){
	console.log('we are connected');
	socket.emit( 'connection', socket.id );
		
	socket.on("disconnect", function(){ 
		mychannels.LeaveChannel( socket.id );
		myrooms.LeaveRoom( socket.id );
	});
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
	socket.on( "join channel up", function( channel ){
		// Step 0: Leave the current channel (if we're in one)
		var oldChan = mychannels.LeaveChannel( socket.id );
		if( oldChan ){
			var departureData = { 'sessionId': socket.id };
			socket.broadcast.to( "chan@" + oldChan ).emit( "left room down", departureData );
			socket.emit( "left channel down", departureData );
		}
		
		// Step 1: Join the channel in the model
		mychannels.JoinChannel( socket.id, channel );
		
		// Step 2: Join the channel over socket
		var theChan = mychannels.GetChannel( socket.id );
		socket.join( "chan@" + theChan );
		
		// Step 3: Announce to the world
		var outPut = { 
			'sessionId': socket.id,
			'channelId': theChan
		};
		socket.broadcast.to( "chan@" + theChan ).emit( "join channel down", outPut );
		socket.emit( "join channel down", outPut );
		
		// Step 4: Inform with channel stats also
		var statData = mychannels.ChannelStats(theChan);
		socket.broadcast.to( "chan@" + theChan ).emit( "channel stat down", statData );
		socket.emit( "channel stat down", statData );
	} );
	
	// chat
	socket.on( "chat up", function(data){ 
		// data contains: { sessionId: #,  }
		var middle = { 
			'sessionId': data['sessionId'],
			'message': data['message'],
			'channelId': data['channelId']
		};
		if( data['channelId'] == undefined ){
			socket.broadcast.emit( "chat down", middle );
		}
		else{ 
			socket.broadcast.to( "chan@" + data['channelId'] ).emit( "chat down", middle );
		}
		socket.emit( "chat down", middle );
	});
	
		
	/****************************
	* Game Server Response          *
	****************************/
	// join room
	socket.on( "join room up", function( room ){
		// Step 0: Leave the current room (if we're in one)
		var oldRoom = myrooms.LeaveRoom( socket.id );
		if( oldRoom ){
			var departureData = { 'sessionId': socket.id };
			socket.broadcast.to( "room#" + oldRoom ).emit( "left room down", departureData );
			socket.emit( "left room down", departureData );
		}
		
		// Step 1: Join the room in the model
		myrooms.JoinRoom( socket.id, room );
		
		// Step 2: Join the room over socket
		var theRoom = myrooms.GetRoom( socket.id );
		socket.join( "room#" + theRoom );
		
		// Step 3: Announce to the world
		var outPut = { 
			'sessionId': socket.id,
			'roomId': theRoom
		};
		socket.broadcast.to( "room#" + theRoom ).emit( "join room down", outPut );
		socket.emit( "join room down", outPut );
		
		// Step 4: Inform with channel stats also
		var statData = myrooms.RoomStats(theRoom);
		socket.broadcast.to( "room#" + theRoom ).emit( "room stat down", statData );
		socket.emit( "room stat down", statData );
	} );
	
	// game event
	socket.on( "game event up", function(data){ 
		var middle = { 
			'sessionId': data['sessionId'],
			'name': data['name'],
			'event': data['event'],
			'roomId': data['roomId']
		};
		console.log( "middle: " + JSON.stringify( middle ) );
		if( data['roomId'] == undefined ){
			var theRoom = myrooms.GetRoom( data['sessionId'] );
			socket.broadcast.to( "room#" + theRoom ).emit( "game event down", middle );
		}
		else{ 
			socket.broadcast.to( "room#" + data['roomId'] ).emit( "game event down", middle );
		}
		socket.emit( "game event down", middle );
	});
	
	// sync
	socket.on( "sync up", function( syncRatio ){ 
		// TODO: write this
		var syncValue;
		socket.emit( "sync down", syncValue );	
	});
	
	// Starting a game
	socket.on( "start game up", function(data){ 
		var room = data['roomId'];
		var result = myrooms.StartGame( room );
		if( result ){
			socket.broadcast.to( "room#" + room).emit( "start game down", result );
			socket.emit( "start game down", result );
		}
	} );	
});


