/**********************
* Tooltip class   			    *
**********************/
var tooltip = function(){
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
	//$("#faggot").html("we're in boss!");
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
   //$("#faggot").html( (u - h) + 'px' + " and " + (l + left) + 'px' );
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
var SHOP_ID = "indigio_game_embedded_shop",
	SHOP_WIDTH = 480 ,
	SHOP_HEIGHT = 220 ,
	EXIT_WIDTH =  75 ,
	EXIT_HEIGHT =  75 ,
	ITEMS_PER_SHOP = 10 ,
	ITEM_TILE_HEIGHT = 75,
	ITEM_TILE_WIDTH = 75 ,
	SHOP_EASY_MODE = false ,
	SHOP_BGCOLOR = "rgb( 176, 209, 224 )";

function RefreshConstants( width, height ){ 
	return;
	if( SHOP_EASY_MODE )
		return;
	SHOP_WIDTH = width;
	SHOP_HEIGHT = height;
	EXIT_WIDTH =  SHOP_WIDTH / 10;
	EXIT_HEIGHT =  SHOP_WIDTH / 10;
	ITEM_TILE_HEIGHT = SHOP_WIDTH / 10 - 10;
	ITEM_TILE_WIDTH = SHOP_WIDTH / 10 - 10;
}

/**********************
* API Variables               *
**********************/
// The shop for the programmer's convenience
var myShop;

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
	this.mall;
	this.items;
	this.itemtiles;
	this.exit;
	this.tabs;
	this.initializationFlag = false;
	
	// private variables
	this.itemAnimations;
	this.itemtileAnimation;
	this.lockedAnimation;
	this.vacantAnimation;
	this.exitAnimation;
	
	this.initialize = function( gamedata ){ 
		if( this.initializationFlag )
			return;
		if( gamedata == undefined )
			gamedata = [];
		var shopwidth = gamedata['shopwidth'];
		var shopheight = gamedata['shopheight'];
		var divid = gamedata['elementid'];
		var shopx = gamedata['shopx'], shopy = gamedata['shopy'];
		
		if( shopwidth == undefined )
			shopwidth = SHOP_WIDTH;
		if( shopheight == undefined )
			shopheight = SHOP_HEIGHT;
		if( divid == undefined )
			divid = 'body';
		if( shopx == undefined )
			shopx = 250;
		if( shopy == undefined )
			shopy = 150;
		
		// Refreshing stuff
		RefreshConstants( shopwidth, shopheight );	
		
		// Initialization
		this.lockedAnimation = new $.gameQuery.Animation( { 
			imageURL: "images/shopicons/locked.png" 
		} );
		
		this.vacantAnimation = new $.gameQuery.Animation({
			imageURL: "images/shopicons/vacant.png"
		});
		
		this.exitAnimation = new $.gameQuery.Animation({ 
			imageURL: "images/shopicons/Close.png",
			width: EXIT_WIDTH,
			height: EXIT_HEIGHT,
		} );
		this.itemtileAnimation = new $.gameQuery.Animation({
			imageURL: "images/shopicons/itemicon.png"
		});
		
		
	
		// Creating the shop div
		var shopid = SHOP_ID;
		$( divid ).append( "<div id='" + shopid + "'></div>" );
		this.container = $( "#" + shopid );
		this.container.playground( { 
			width: shopwidth, 
			height: shopheight 
		} );
		this.mall = $.playground().addGroup( shopid + "-mall", { 
			width : shopwidth,
			height : shopheight
		} );
		this.mall.addSprite( shopid + "-exit", {
			'width' : EXIT_WIDTH , 
			'height' : EXIT_HEIGHT ,
			'posx' : shopwidth - EXIT_WIDTH + 5 ,
			'posy' : shopheight - EXIT_HEIGHT + 5 ,
		} );
		this.exit = $( "#" + shopid + "-exit" );
		this.exit.setAnimation( this.exitAnimation );
		
		// Setting up the sprites for the 10 items
		this.items = []; this.itemtiles = [];
		for( var k = 0; k < ITEMS_PER_SHOP; k++ ){
			var itemdata = { 
				'width': ITEM_TILE_WIDTH,
				'height': ITEM_TILE_HEIGHT,
				'posx': ( k % 5 ) * ITEM_TILE_WIDTH + 5,
				'posy' : ( k >= 5 ) * ITEM_TILE_HEIGHT + 5 ,
			};
			var itemtiledata = { 
				'animation': this.itemtileAnimation,
				'width': ITEM_TILE_WIDTH,
				'height': ITEM_TILE_HEIGHT,
				'posx': ( k % 5 ) * ITEM_TILE_WIDTH + 5,
				'posy' : ( k >= 5 ) * ITEM_TILE_HEIGHT + 5 ,
			};
			this.mall.addSprite( shopid + "-item" + k, itemdata );
			this.mall.addSprite( shopid + "-itemtile" + k, itemtiledata );
			this.items.push( $("#" + shopid + "-item" + k ) );
			this.itemtiles.push( $("#" + shopid + "-itemtile" + k ) );
			this.itemtiles[k].css( "z-index", 507 );
			this.items[k].css( "z-index", 508 );
		}
	
		// registering a callback to close the shop 
		// in case you're reading this and getting cancer, here is what is going on
		// I declare an anonymouse function of 1 variable
		// which returns a function closing the dom element passed in
		this.exit.click( (function(faggot){
			return function(){ faggot.hide(1000); };
		})(this.container) );
		this.exit.mouseover( function(){
			tooltip.show( "Close the shop" );
		} );
		this.exit.mouseleave( function(){ 
			tooltip.hide();
		} );
		
		// We have to put this container shit somewhere
		this.container.css( "left", shopx );
		this.container.css( "top", shopy );
		this.container.css( "background-color", SHOP_BGCOLOR );
		this.container.css( "z-index", 500 );
		//this.container.hide();
		
		// Setting the flag
		this.initializationFlag = true;
		
	}
	
	this.LoadShop = function( items ){ 
		this.itemAnimations = [];
		for( var k = 0; k < items.length; k++ )
		this.itemAnimations.push( new $.gameQuery.Animation({ 
			imageURL: items[k]['tileset']
		}));
		
	}
	
	// The only function that the outside world should call
	this.SetupShop = function( items, gamedata ){ 
		// Step 0: doing setup
		if( items == undefined )
			return;
		if( this.initializeFlag )
			this.destroy();
		this.initialize(gamedata);
		this.LoadShop( items );
		$.playground().startGame();
		
		// Step 1: Loading the items
		var itemCount = items.length > 10 ? 10 : items.length;
		// A tab holds 10 items. Eventually, we want more tabs, for now, we have only 1
		var k, j;
		
		for( k = 0; k < itemCount; k++ ){
			this.items[k].setAnimation( this.itemAnimations[k] );
			
			// Registering reactionary events
			this.items[k].mouseover( GetMouseOverCallback( items[k] ) );
			this.items[k].mouseleave( function(){ 
				tooltip.hide();
			} );
			this.items[k].click( GetBuyCallback( items[k], this ) );
		}
		
		for( j = 0; k + j < 10; j++ ){ 
			this.items[k+j].setAnimation( this.lockedAnimation );
			this.items[k+j].mouseover( function(){ 
				tooltip.show( "Item locked" );
			} );
			this.items[k+j].mouseleave( function(){ 
				tooltip.hide();
			} );
		}
		
		myShop = this;	
	}
	
	this.CloseShop = function(){ 
		this.destroy();
	}
	
	this.destroy = function(){ 
		// Step 1: Remove all the elements
		this.container.remove();
		
		// Step 2: Null all the dom elements
		this.container = undefined;
		this.mall = undefined;
		this.items = undefined;
		this.exit = undefined;
		this.tabs = undefined;
		
		// Step 3: deleting the animations
		delete this.itemAnimations;
		delete this.lockedAnimation;
		delete this.vacantAnimation;
		delete this.exitAnimation;
		
		// Step 4: Setting the flag
		this.initializationFlag = false;
	}
	
	this.SetupConfirmation = function( item ){ 
		
	}
}


function GetMouseOverCallback( item ){ 
	return function(){ 
		tooltip.show( "<p>Description: " + item['description'] + "</p><p>Price: $" + item['price'] + "</p>" );
	};
}

function GetBuyCallback( item, theShop ){ 
	return function(){ 
		theShop.SetupConfirmation( item );
	};
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
myShop = new IndigioShop();
function CallShop( gamedata ){ 
	ShopSimpleMode = true;
		
	// let the server know what we need
	GetShopItems( gamedata );
}

// metadata is not required
function GetShopItems( metadata ){ 
	var data = { 'sessionId': sessionId, 'metadata': metadata }
	socket.emit( "open shop up", data );
}

socket.on( "open shop down", function( data ){ 
	alert(JSON.stringify(data));
	var tempItems = data['items'];
	if( data['sessionId'] == sessionId ) {
		shopItems = (function(raw){ 
			var output = [];
			for( var k = 0; k < raw.length; k++){ 
				var fag = raw[k];
				output.push( { 
					'description': fag['description'],
					'id': fag['id'],
					'company_id': fag['company_id'],
					'tileset': fag['picture_path'],
					'price': fag['cost'],
					'title': fag['title'],
					'created_at': fag['created_at'],
					'updated_at': fag['updated_at']
				} );
			}
			return output;
		})( tempItems );

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

AddShopFunction( "open shop down", function(stuff){ 
	if( ShopSimpleMode != true ){ 
		return;
	}
	myShop.SetupShop( stuff );
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
//hkhgkjhkjjk
//reenterint stuff so it knows whats up

