/***********************
* Game Client API Code  *
***********************/
var socket = io.connect('http://localhost');
var sessionId;

socket.on( "connection", function(id){ 
	sessionId = id;
});

/**********************
* Constants & Config      *
**********************/
var STATE_PREGAME = 0;
var STATE_INGAME = 1;


/**********************
* API Variables               *
**********************/
// When nonzero, the playerToken can be used for a player to buy stuff
var playerToken = 0;

// Contains 3 hashed arrays of buyable items
var shopItems = {};

// Player states vary between pre-game and in-game
var playerState = STATE_PREGAME;

// Percentage deviation from perfect synchronization in game states
// value goes from 0 (total desync) to 100 (perfect sync).
// -1 means we're either not in a game, or error has occured.
var syncPercentDeviation = -1;

// Hash map to hold shop-related functions
var shopFunctionHandlers = {};

// Hash map to hold event handling game-related functions
var gameFunctionHandlers = {};

// Hash map for chat related event handling
var chatFunctionHandlers = {};

// Channel name the player is currently in (for references only)
var currentChannel;

// Current gameroom the player is in (for references only)
var currentRoom;

/**********************
* Programmer Functions *
**********************/
// Add a function to handle shop events
function AddShopFunction( eventname, func ){ 
	if( shopFunctionHandlers[ eventname ] === undefined ) { 
		shopFunctionHandlers[ eventname ] = [];
	}
	shopFunctionHandlers[ eventname ].push( func );
}

// Adds a function to handle game events
function AddGameFunction( eventname, func ){ 
	if( gameFunctionHandlers[ eventname ] === undefined ) { 
		gameFunctionHandlers[ eventname ] = [];
	}
	gameFunctionHandlers[ eventname ].push( func );
}

// Adds a function handler to chat events
function AddChatFunction( eventname, func ){ 
	if( chatFunctionHandlers[ eventname ] === undefined ) { 
		chatFunctionHandlers[ eventname ] = [];
	}
	chatFunctionHandlers[ eventname ].push( func );
}

/**********************
* User Functions               *
**********************/
// playerinfo is a json 
function LoginPlayer( playerinfo ){
	var data = { 'sessionId': sessionId, 'login': playerinfo }; 
	socket.emit( "player login up", data ); 
}

socket.on( "player login down", function(data) { 
	if(data['sessionId'] == sessionId) 
		playerToken = data['token'];
	else {
		// inform player of mistake
	}
	// TODO: write code to handle the case when player tokens are false
});


/**********************
* Shop Functions              *
**********************/
// metadata is not required
function GetShopItems( metadata ){ 
	var data = { 'sessionId': sessionId, 'metadata': metadata }
	socket.emit( "open shop up", data );
}

socket.on( "open shop down", function( data ){ 
	if( data['sessionId'] == sessionId ) {
		shopItems = data['items'];
		var handlers = shopFunctionHandlers[ 'open shop down' ];
		for( var x in handlers ){
			handlers[x]( shopItems );
		}
	}
	// TODO: write code to handle bad items or whatever
} );

// playerToken and item id are required to complete a purchase
function BuyItem( player, item ){ 
	socket.emit( "purchase item up", { playerToken: player, itemId: item } );
}

socket.on( "purchase item down", function(result){
	// TODO: write a function to display some sort of message for success or failure
} );

/**********************
* Channel functions         *
**********************/
// channels are for the purpose of pre-game chat
// player can be the player token or ip address.
// if no channel is specified, the server decides where to put the player
function JoinChannel( channel ){ 
	socket.emit( "join channel up", channel, function( result ){ 
		// TODO: write a function to let the player know he has joined a new room
		playerState = STATE_PREGAME;
	});
}

socket.on( "join channel down", function( channeldata ){
	// TODO: let the player he has not left his previous channel
	currentChannel = channeldata['channelId'];
	var handlers = chatFunctionHandlers['join channel down'];
	for( var x in handlers ){ 
		handlers[x](channeldata);
	}
} );

socket.on( "left channel down", function( data ){
	currentChannel = undefined;
	var handlers = chatFunctionHandlers['left channel down'];
	for( var x in handlers ){ 
		handlers[x](data);
	}
} );

socket.on( "channel stat down", function( data ){ 
	var handlers = chatFunctionHandlers['channel stat down'];
	for(var x in handlers ){ 
		handlers[x](data);
	}
} );

/**********************
* Gameroom functions     *
**********************/
// Game rooms (just rooms) are where games happen and exist in the during-game
// player can be the token or the ip address.
// if no roomid is specified, the server puts the player into the a game randomly
function JoinRoom( room ){ 
	socket.emit( "join room up", room, function( result ){ 
		// TODO: write me!
		playerState = STATE_INGAME;		
	} );
}

socket.on( "join room down", function( roomdata ){
	// TODO: let the player know he has joined a game
	currentRoom = roomdata['roomId'];
	var handlers = gameFunctionHandlers['join room down'];
	for( var x in handlers ){ 
		handlers[x](roomdata);
	}
} );

socket.on( "left room down", function( data ){
	// TODO: let the player know he has joined a game
	currentRoom = undefined;
	var handlers = gameFunctionHandlers['left room down'];
	for( var x in handlers ){ 
		handlers[x](data);
	}
} );

socket.on( "room stat down", function( data ){ 
	var handlers = gameFunctionHandlers['room stat down'];
	for(var x in handlers ){ 
		handlers[x](data);
	}
} );

/**********************
* Chat functions              *
**********************/
// if no receiver is specified, the message is delivered to the channel or room the player is in
function PlayerChat( message ){ 
	socket.emit( "chat up", { 'sessionId': sessionId, 'message': message, 'channelId': currentChannel } );
}



socket.on( "chat down", function( event ){ 
	// TODO: Write a function 
	// alert(chatFunctionHandlers);
	var handlers = chatFunctionHandlers['chat down'];
	for( var x in handlers ){ 
		handlers[x](event);
	}
});


/**********************
* Game functions            *
**********************/
// if no receiver is specified, the message is delivered to every player in the game room
function FireEvent( name, event, receiver ){ 
	var middle =  { 
		'senderId': sessionId, 
		'name': name, 
		'event': event, 
		'receiverId': receiver 
	};
	
	socket.emit( "game event up", middle, function( result ){ 
		// TODO: write me!
		socket.emit( "sync up", syncPercentDeviation);
	} );
}

function StartGame( room ){ 
	var middle = {
		'roomId': room
	};
	socket.emit( 'start game up', middle );
}

socket.on( "start game down", function( data ){ 
	var handlers = gameFunctionHandlers['start game down'];
	for( var x in handlers ){ 
		handlers[x](data);
	}	
} );

socket.on("sync down", function( value ){ 
	syncPercentDeviation = value;
});

socket.on("game event down", function(data){
	// TODO: handle the null case when there are no event handlers
	var handlers = gameFunctionHandlers[data['name']]
	for( var x in handlers ){ 
			handlers[x](data['event']);
	}		
} );


