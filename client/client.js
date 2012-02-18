/***********************
* Client side js code          *
***********************/
// Constants
var SERVER_NAME = "http://localhost";

// Declarations
var socket = io.connect(SERVER_NAME);
var percentSynchronizationDeviation;
var ingidioShops;
var playerToken;
var ingidioEventHandlerHashTable = {};

// Push event handlers
function AddEventHandler( eventname, eventhandler ){ 
	ingidioEventHandlerHashTable[ eventname ] += [eventhandler];
} 

function RemoveEventHandler( eventname, eventhandler ){
	// TODO: write me!
}
// Shop specifications
socket.on("shop order successful", function(data){

});

// metadata is a json file or a search string 
// Metadata should be a json that looks like:
/*
{ 
	count : #### ,
	search : " askjdflaksdjfl "	
}
*/
function GetShopItems( player, metadata ){ 
	// calls out the shops
	socket.emit( "call shop", function(shopdata){ 
		ingidioShops = shopdata;
	});
} 

// Purchases items
function BuyShopItem( player, item ){ 

}

// Logs in the player. Not everything is necessary, but it won't log you in if you don't provide enough info
/*
{ 
	username : * ,
	password : * , 
	email : * ,
	creditcard : * ,
	expiration : * ,
	ccv : * ,
	billing_name : * ,
	billing_address : *,
	shipping_address : * ,
}
*/
function LoginPlayer( logininfo ){ 
	socket.emit( "player logging in", function( message ) { 
		playerToken = message;
	} );
}

// Events from the server
socket.on( "event down", function(data){
	ingidioEventHandlerHashTable[data[eventname]]( data[event] )
} );

// Events to the server
// Sender should be a json file that looks like:
/*
{
	senderid : #### ,
	roomid : ####
}
*/
// data could look like whatever you want; the server doesn't do anything with it except pass it on
// receiver should look like the following:
/*
{ 
	receiverid : #### ,
	roomid : ####
}
*/
// if nothing is specified, the server sends your data to everyone in your current room
// or everyone in your channel if you're not in a game
function UpdateEvent( sender, data, receiver ) {
	socket.emit( "event up", { "sender" : sender, "data" : data, "receiver" : receiver } );
}

// gamestate should be a json file. What it will look like is up to you
// the server attempts to find the standard deviation of all the game states of the current game
// room. It will then update the percentSynchronizationDeviation variable with a new value.
// The value is a number between 0 and 100 where 0 means we're in absolute sync and 100 means
// everyone is effectively seeing a different game. What you do with the number is up to you
function UpdateSynchronizationDeviation( sender, gamestate ){ 
	socket.emit("sync up", { "sender" : sender , "gamestate" : gamestate } );
	socket.on("sync down", function( value ) { percentSynchronizationDeviation = value; } );
}
