/****************************
* Functional Shop Class             *
*****************************/
// Some specifications
/**
items = { 
	'description': 
	'id': for your use
	'company_id': brand name can go here
	'tileset': the picture path
	'price': #
	'title': #
}
*/
/**
specs = { 
	id : if you want to specify 
	width :
	height :
	posx :
	posy :
	z-index:
	background : { css }
	tile : { css }
	callback : { eventname : callback }
}
*/
var InGidioShop = function(){ 
	var spec = {
		'id': DEFAULT_ELEMENT_ID,
		'width': DEFAULT_SHOP_WIDTH,
		'height': DEFAULT_SHOP_HEIGHT,
		'posx': DEFAULT_SHOP_X,
		'posy': DEFAULT_SHOP_Y,
		'posz': DEFAULT_SHOP_Z,
		'background' : { 
			'background-color': DEFAULT_BACKGROUND_COLOR,
			'border': DEFAULT_BACKGROUND_BORDER,
			'image': DEFAULT_BACKGROUND_IMAGE,
			' -moz-border-radius' : "25px",
			'border-radius' : "25px"
		},
		'tile' : { 
			'width' : DEFAULT_TILE_WIDTH,
			'height' : DEFAULT_TILE_HEIGHT,
			'columnper' : DEFAULT_COLUMN_PER,
			'rowper': DEFAULT_ROW_PER,
			'z-index' : DEFAULT_TILE_Z ,
			' -moz-border-radius' : "5px",
			'border-radius' : "5px"
		},
		'ui' : { 
			'buttonwidth' : DEFAULT_BUTTON_WIDTH,
			'buttonheight' : DEFAULT_BUTTON_HEIGHT,
			'z-index' : DEFAULT_UI_Z
		},
		'form' : { 
			'z-index' : DEFAULT_UI_Z,
			'border': DEFAULT_FORM_BORDER,
			'background-color': DEFAULT_FORM_COLOR,
			'width': DEFAULT_FORM_WIDTH ,
			'height': DEFAULT_FORM_HEIGHT,
			'opacity' : 0.97
		},
		'flash' : { 
			'width' : DEFAULT_FLASH_WIDTH,
			'height' : DEFAULT_FLASH_HEIGHT ,
			'z-index' : DEFAULT_UI_Z,
			'border' : DEFAULT_FLASH_BORDER ,
			'background-color' : DEFAULT_FLASH_COLOR,
			'opacity' : 0.97
		},
		'callbacks': { 
			'shopclose': function(){ },
			'buyfailed' : function(){ },
			'buysuccessful' : function(){ },
			'buyitem' : function(item, paydata){ 
				InGidioShop.BuyItem( item, paydata );
			} , // end buyitem
			'approve' : function(){ }
		}
	};
	return{ 
		BuyItem : function(item, paydata){ 
			// Step 1: Setup the query string with jquery
			var data = $.extend( item, paydata );
			data['url'] = document.url;
			// var querydata = $.param( data );
			BuyItem( data );
		}, // end BuyItem
		CallSimpleShop : function(items, specs){
			// Step 1: Setting custom specs and necessar
			var cspec = spec;
			if( specs != undefined )
				cspec = $.extend( specs, spec );
			var generator = new Generator();
			generator.initialize(items, cspec);
							
			// Step 2: Setting up the shop container
			var container = generator.CreateContainer();
			var tiles = generator.CreateTiles();
			var gui = generator.CreateUI();
			
			// Step 3: Present user with the shop
			container.show();
			container.css( "border-radius", "25px" );
			container.css( "-moz-border-radius" , "25px" );
			for( var k = 0; k < tiles.length; k++ ){
				tiles[k].css( "left", (k % DEFAULT_ROW_PER ) * ( cspec['tile']['width'] + 5 ) + 55 );
				tiles[k].css( "top", 5 );
				if( Math.floor( k / DEFAULT_ROW_PER ) > 1 ){ 
					tiles[k].hide();
				}
				else{
					tiles[k].show();
				}
			}
			for( var k in gui )
				gui[k].hide();
			
			// Step 4: Return the shop object programatically
			return { 
				'container' : container,
				'tiles' : tiles,
				'gui' : gui
			}; // end return
		}, // end CallSimpleShop 
		CallNormalShop : function(items, specs){
		
		},
		CallHardShop : function(items, specs){
		
		}
	}; // end return
} ();// end InGidioShop


