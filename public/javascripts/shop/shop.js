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
		'mallwidth' : MALL_WIDTH,
		'mallheight' : MALL_HEIGHT,
		'width': DEFAULT_SHOP_WIDTH,
		'height': DEFAULT_SHOP_HEIGHT,
		'posx': DEFAULT_SHOP_X,
		'posy': DEFAULT_SHOP_Y,
		'posz': DEFAULT_SHOP_Z,
		"opacity" : 1 ,
		'background' : { 
			'background-color': DEFAULT_BACKGROUND_COLOR,
			'border': DEFAULT_BACKGROUND_BORDER,
			'image': DEFAULT_BACKGROUND_IMAGE,
			' -moz-border-radius' : "25px",
			'border-radius' : "25px" ,
			"opacity" : 1
		},
		'tile' : { 
			'width' : DEFAULT_TILE_WIDTH,
			'height' : DEFAULT_TILE_HEIGHT,
			'columnper' : DEFAULT_COLUMN_PER,
			'rowper': DEFAULT_ROW_PER,
			'z-index' : DEFAULT_TILE_Z ,
			' -moz-border-radius' : "5px",
			'border-radius' : "5px",
			"opacity" : 1
		},
		'ui' : { 
			'buttonwidth' : DEFAULT_BUTTON_WIDTH,
			'buttonheight' : DEFAULT_BUTTON_HEIGHT,
			'z-index' : DEFAULT_UI_Z,
			"opacity" : 1
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
		CallSimpleShop : function(items, niggers){
			// Step 1: Setting custom specs and necessar
			var cspec = spec;
			if( niggers != undefined )
				cspec = $.extend( cspec, niggers );
			// alert( JSON.stringify(cspec) );
			var generator = new Generator();
			generator.initialize(items, cspec);
							
			// Step 2: Setting up the shop container
			var container = generator.CreateContainer();
			var sparetiles = generator.CreateSpareTiles( "locked" );
			var tiles = generator.CreateTiles();
			var gui = generator.CreateUI();
			
			// Step 3: Present user with the shop	
			container.show();
			container.css( "border-radius", "25px" );
			container.css( "-moz-border-radius" , "25px" );
			var k, j;
			for( k = 0; k < tiles.length; k++ ){
				var xpos = (k % DEFAULT_ROW_PER ) * ( cspec['tile']['width'] + 5 ) + 55;
				tiles[k].css( "left", xpos + 'px' );
				tiles[k].css( "top", 5 );
				sparetiles[k].hide();
				if( Math.floor( k / DEFAULT_ROW_PER ) > 1 ){ 
					tiles[k].hide();
				}
				else{
					tiles[k].show();
				}
			}
			for( j = k; j < DEFAULT_ROW_PER; j++){ 
				var xpos = (j % DEFAULT_ROW_PER ) * ( cspec['tile']['width'] + 5 ) + 55;
				sparetiles[j].css( "left", xpos + 'px' );
				sparetiles[j].css( "top", 5 );
				sparetiles[j].show();
			}
			for( var k in gui )
				gui[k].hide();
			gui['smallclose'].show();
			gui['arrow'].show();
			
			// Step 3.5: Setting the arrow scroller
			var arrowcounter = 1;
			gui['arrow'].click( function(e){ 
				if( tiles.length <= DEFAULT_ROW_PER ){
					generator.CreateFlashMessage( "No more items!", { x : e.pageX, y : e.pageY } );
					return;
				}
				arrowcounter += 1;
				arrowcounter = arrowcounter % DEFAULT_ROW_PER;
				
				var k, j;
				for( k = 0; k < tiles.length; k++ ){ 
					sparetiles[k].hide();
					if( Math.floor( k / DEFAULT_ROW_PER ) == arrowcounter ){ 
						tiles[k].show(450);
					}
					else{
						tiles[k].hide();
					}
				} // end for loop
				for( j = k; j < DEFAULT_ROW_PER; j++){ 
					sparetiles[j].show();
				}
				
			} );
			
			// Step 4: Return the shop object programatically
			return { 
				'container' : container,
				'tiles' : tiles,
				'gui' : gui
			}; // end return
		}, // end CallSimpleShop 
		CallNormalShop : function(items, specs){
			// Step 1: Setting custom specs and necessar
			var cspec = spec;
			if( specs != undefined )
				cspec = $.extend( cspec, specs );
			var generator = new Generator();
			generator.initialize(items, cspec);
			
			// Step 2: Generating the tiles
			var itemtiles = NormalShop.Stock( items );
			
			return { 
				lockedtiles : lockedtiles ,
				vacanttiles : vacanttiles ,
				itemtiles : itemtiles ,
				kill : function(){ 
					generator.destroy();
				}
			};
		}, // end CallNormalShop
		CallHardShop : function(items, specs){
		
		}
	}; // end return
} ();// end InGidioShop


