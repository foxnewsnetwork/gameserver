/***********************
* Game Client API Code  *
***********************/
var socket = io.connect('http://localhost');


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

// Hash map to hold event handling game-related functions
var gameFunctionHandlers = {};

// Hash map for chat related event handling
var chatFunctionHandlers = {};


/**********************
* Programmer Functions *
**********************/
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
	socket.emit( "player login up", playerinfo ); 
}

socket.on( "player login down", function(token) { 
	playerToken = token;
	// TODO: write code to handle the case when player tokens are false
});


/**********************
* Shop Functions              *
**********************/
// metadata is not required
function GetShopItems( metadata ){ 
	socket.emit( "open shop up", metadata );
}

socket.on( "open shop down", function( items ){ 
	shopItems = items;
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
function JoinChannel( player, channel ){ 
	socket.emit( "join channel up", { playerInfo: player, channelId: channel }, function( result ){ 
		// TODO: write a function to let the player know he has joined a new room
		playerState = STATE_PREGAME;
	});
}

socket.on( "join channel down", function( result ){
	// TODO: let the player he has not left his previous channel
} );

/**********************
* Gameroom functions     *
**********************/
// Game rooms (just rooms) are where games happen and exist in the during-game
// player can be the token or the ip address.
// if no roomid is specified, the server puts the player into the a game randomly
function JoinGame( player, room ){ 
	socket.emit( "join game up", { playerInfo: player, roomId: room }, function( result ){ 
		// TODO: write me!
		playerState = STATE_INGAME;		
	} );
}

socket.on( "join game down", function( result ){
	// TODO: let the player know he has joined a game
} );

/**********************
* Chat functions              *
**********************/
// if no receiver is specified, the message is delivered to the channel or room the player is in
function PlayerChat( sender, message, receiver ){ 
	socket.emit( "chat up", { senderId: sender, text: message, receiverId: receiver }, function( result ){ 
		// TODO: write me!
	} );
}

socket.on( "chat down", function( event ){ 
	// TODO: Write a function 
	var handlers = chatFunctionHandlers[event['name']];
	for( var x in handlers ){ 
		handlers[x](event['data']);
	}
})

/**********************
* Game functions            *
**********************/
// if no receiver is specified, the message is delivered to every player in the game room
function UpdateServer( sender, event, receiver ){ 
	socket.emit( "game event up", { senderId: sender, data: event, receiverId: receiver }, function( result ){ 
		// TODO: write me!
		socket.emit( "sync up", syncPercentDeviation);
	} );
}

socket.on("sync down", function( value ){ 
	syncPercentDeviation = value;
});

socket.on("game event down", function(event){
	// TODO: handle the null case when there are no event handlers
	var handlers = gameFunctionHandlers[event['name']]
	for( var x in handlers ){ 
			handlers[x](event['data']);
	}		
} );

