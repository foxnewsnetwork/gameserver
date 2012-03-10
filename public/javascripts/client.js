/***********************
* External-Use Library  *
***********************/

var ExternalIndigioLibrary_tooltip = function(){
 var id = 'tt';
 var top = 3;
 var left = 3;
 var maxw = 300;
 var speed = 10;
 var timer = 20;
 var endalpha = 95;
 var alpha = 0;
 var tt,t,c,b,h;
 var ie = document.all ? true : false;
 return{
  show:function(v,w){
   if(tt == null){
    tt = document.createElement('div');
    tt.setAttribute('id',id);
    tt.style.zindex = 999;
    t = document.createElement('div');
    t.style.zindex = 999;
    t.setAttribute('id',id + 'top');
    c = document.createElement('div');
    c.style.zindex = 999;
    c.setAttribute('id',id + 'cont');
    b = document.createElement('div');
    b.style.zindex = 999;
    b.setAttribute('id',id + 'bot');
    tt.appendChild(t);
    tt.appendChild(c);
    tt.appendChild(b);
    document.body.appendChild(tt);
    tt.style.opacity = 0;
    tt.style.filter = 'alpha(opacity=0)';
    document.onmousemove = this.pos;
   }
   tt.style.display = 'block';
   c.innerHTML = v;
   tt.style.width = w ? w + 'px' : 'auto';
   if(!w && ie){
    t.style.display = 'none';
    b.style.display = 'none';
    tt.style.width = tt.offsetWidth;
    t.style.display = 'block';
    b.style.display = 'block';
   }
  if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
  h = parseInt(tt.offsetHeight) + top;
  clearInterval(tt.timer);
  tt.timer = setInterval(function(){tooltip.fade(1)},timer);
  },
  pos:function(e){
   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
   tt.style.top = (u - h) + 'px';
   tt.style.left = (l + left) + 'px';
  },
  fade:function(d){
   var a = alpha;
   if((a != endalpha && d == 1) || (a != 0 && d == -1)){
    var i = speed;
   if(endalpha - a < speed && d == 1){
    i = endalpha - a;
   }else if(alpha < speed && d == -1){
     i = a;
   }
   alpha = a + (i * d);
   tt.style.opacity = alpha * .01;
   tt.style.filter = 'alpha(opacity=' + alpha + ')';
  }else{
    clearInterval(tt.timer);
     if(d == -1){tt.style.display = 'none'}
  }
 },
 hide:function(){
  clearInterval(tt.timer);
   tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
  }
 };
}();


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
var SHOP_ID = "indigio_game_embedded_shop";

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
* Shop Class                     *
**********************/
var IndigioShop = function(){
	this.container;
	this.items;
	this.exit;
	this.tabs;
	this.initializationFlag = false;
	
	this.initialize = function( gamedata ){ 
		if( this.initializationFlag )
			return;
		var shopwidth = gamedata['shopwidth'];
		var shopheight = gamedata['shopheight'];
		var divid = gamedata['divid'];
	
		if( shopwidth == undefined )
			shopwidth = 480;
		if( shopheight == undefined )
			shopheight = 360;
		if( divid == undefined ){ 
			// TODO: set the div id
		}	
	
		// Creating the shop div
		var shopid = SHOP_ID;
		$("#" + divid).create( "<div id='" + shopid + "'></div>" );
		this.container = $( "#" + shopid );
		this.container.("<button id='close_" + shopid + "'></button>"); 
	
		// Setting its styles
		this.container.css( "width", shopwidth + "px" );
		this.container.css( "height", shopheight + "px" );
		this.container.css( "left", "10px" );
		this.container.css( "top", "10px" );
		this.container.css( "z-index", 998 );
	
		// registering a callback to close the shop 
		$("#close_" + shopid).click( function(){ 
			this.container.hide();
		} );
		this.exit = $( "#close_" + shopid );
		
		// Setting the flag
		this.initializationFlag = true;
	}
	
	this.SetupShop = function( items ){ 
		this.items = [];
		
		var itemCount = items.length > 10 ? 10 : items.length;
		
		// A tab holds 8 items. Eventually, we want more tabs, for now, we have only 1
		this.container.html("<div id='indigio_shop_tab1'></div>");
		this.tabs = $("#indigio_shop_tab1");
		for( var k = 0; k < itemCount; k++ ){
			var xpos, ypos;
			xpos = 75 * ( k % 5 ) +  5;
			ypos = 75 * ( k >= 5 ) + 5;
			this.tabs.append( "<div id=indigio_shop_item'" + k + "'></div>" );
			this.items.push = $( "#indigio_shop_item" + k );
			this.items[k].css( 'width', '75px' );
			this.items[k].css( 'height', '75px' );
			this.items[k].css( 'left', xpos + "px" );
			this.items[k].css( 'top', ypos + "px" );
			this.items[k].css( 'background-image', "url( " + items[k]['tileset'] + " )" );
			// Registering reactionary events
			this.items[k].mouseover( function(){ 
				ExternalIndigioLibrary_tooltip.show( "<p>" + items[k]['description'] + "</p><p>Price: " + items[k]['price'] + "</p>" );
			} );
			this.items[k].mouseleave( function(){ 
				ExternalIndigioLibrary_tooltip.hide();
			} );
			this.items[k].click( GetBuyCallback( items[k] ) );
		}
			
	}
}

function GetBuyCallback( item ){ 
	if( playerToken != 0 ){
		return function(){ 
			BuyItem( playerToken, item );
		};
	}
	else{ 
		// Handle login
	}
}

/**********************
* Shop Functions              *
**********************/
// Macro call to summon the shop for the truly lazy
/*
 gamedata = { 
	shopwidth:
	shopheight:
	divid:
	metadata:
}
*/
var ShopSimpleMode = false;
var myShop = new IndigioShop();
function CallShop( gamedata ){ 
	ShopSimpleMode = true;
	myShop.initialize( gamedata );
	
	// let the server know what we need
	GetShopItems( gamedata['metadata'] );
}

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

AddShopFunction( "open shop down", function(shopItems){ 
	if( ShopSimpleMode != true ){ 
		return;
	}
	myShop.SetupShop( shopItems );
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

function LeaveRoom( room ){ 
	var aRoom;
	if( room == undefined )
		aRoom = currentRoom;
	else
		aRoom = room;
	socket.emit( "left room up", { 'sessionId': sessionId, 'roomId': aRoom } );
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
function FireEvent( name, event ){ 
	var middle =  { 
		'sessionId': sessionId, 
		'name': name, 
		'event': event, 
		'roomId': currentRoom
	};
	socket.emit( "game event up", middle, function( result ){ 
		// TODO: write me!
		socket.emit( "sync up", syncPercentDeviation);
	} );
}

function StartGame( room ){ 
	var middle;
	if( room == undefined )
		middle = { 'roomId': currentRoom };
	else
		middle = { 'roomId': room };
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
			handlers[x](data['sessionId'], data['event']);
	}		
} );


