var playerToken = 1;

var SHOP_ID = "indigio_game_embedded_shop" ,
	SHOP_WIDTH = 480 ,
	SHOP_HEIGHT = 180 ,
	EXIT_WIDTH =  SHOP_WIDTH / 10 ,
	EXIT_HEIGHT =  SHOP_WIDTH / 10 ,
	ITEMS_PER_SHOP = 10 ,
	ITEM_TILE_HEIGHT = SHOP_WIDTH / 10 - 10 ,
	ITEM_TILE_WIDTH = SHOP_WIDTH / 10 - 10 ,
	SHOP_EASY_MODE = false 
	;

function RefreshConstants( width, height ){ 
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
* Shop Class                     *
**********************/
var IndigioShop = function(){
	this.container;
	this.mall;
	this.items;
	this.exit;
	this.tabs;
	this.initializationFlag = false;
	
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
			'posy' : shopheight - EXIT_HEIGHT + 5
		} );
		this.exit = $( "#" + shopid + "-exit" );
		
		// Setting up the sprites for the 10 items
		this.items = [];
		for( var k = 0; k < ITEMS_PER_SHOP; k++ ){ 
			this.mall.addSprite( shopid + "-item" + k, { 
				'width': ITEM_TILE_WIDTH,
				'height': ITEM_TILE_HEIGHT,
				'posx': ( k % 5 ) * ITEM_TILE_WIDTH + 5,
				'posy' : ( k >= 5 ) * ITEM_TILE_HEIGHT + 5
			} );
			this.items.push( $("#" + shopid + "-item" + k ) );
		}
	
		// registering a callback to close the shop 
		this.exit.click( function(){ 
			this.CloseShop();
		} );
		
		// We have to put this container shit somewhere
		this.container.css( "left", shopx );
		this.container.css( "top", shopy );
		this.container.css( "background-color", "rgb( 144, 74, 98 )" );
		this.container.hide();
		
		// Setting the flag
		this.initializationFlag = true;
		$.playground().startGame();
	}
	
	this.SetupShop = function( items ){ 
		this.container.show( 1000 );		
		var itemCount = items.length > 10 ? 10 : items.length;
		// A tab holds 10 items. Eventually, we want more tabs, for now, we have only 1
		for( var k = 0; k < itemCount; k++ ){
			this.items[k].setAnimation( new $.gameQuery.Animation( { 
				imageURL: items[k]['tileset']
			} ) );
			// Registering reactionary events
			this.items[k].mouseover( GetMouseOverCallback( items[k] ) );
			this.items[k].mouseleave( function(){ 
				// ExternalIndigioLibrary_tooltip.hide();
			} );
			this.items[k].click( GetBuyCallback( items[k] ) );
		}
			
	}
	
	this.CloseShop = function(){ 
		this.container.hide();
	}
}

function GetMouseOverCallback( item ){ 
	return function(){ 
		alert( "<p>Description: " + item['description'] + "</p><p>Price: $" + item['price'] + "</p>" );
	};
}

function GetBuyCallback( item ){ 
	if( playerToken != 0 ){
		return function(){ 
			alert( "Purchase pending" );
		};
	}
	else{ 
		// Handle login
		return function(){ alert( "Please login" ); };
	}
}


/*******************************
* Run-use code                                  *
*******************************/
var myshop = new IndigioShop();
	
$(document).ready( function(){ 
 	myshop.initialize();
 	
 	var items = [{
 		'price' : 15.0 ,
 		'description' : "trevor is a fag" ,
 		'tileset' : "images/tiles/0.png"
 	},
 	{
 		'price': 16.0,
 		'description': "trevor is really a fag" ,
 		'tileset' : "images/tiles/1.png"
 	}];
 	myshop.SetupShop( items );
} );
