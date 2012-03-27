/****************************
* Utility Functions Class             *
*****************************/
var s_GCounter = 0;
var Generator = function(){ 
	// Drivebox is the element where the action happens; defaults to body
	this.drivebox;
	// Engine is the html5 graphics group we're going to use, defaults to gameQuery
	this.engine;
	// The groups that contain various elements
	this.groups;
	// Id is the element id that will be attached to all shop-generated dom
	this.id;
	// Animation set
	this.animations = {};
	// items set
	this.items;
	// specifications set
	this.specifications;
	
	this.destroy = function(callback){ 
		this.drivebox.hide(750);
		delete this.specifications;
		delete this.items;
		delete this.animations;
		delete this.id;
		this.group.remove();
		this.engine.remove();
		this.drivebox.remove();
		if( callback != undefined )
			callback();
	}	// end this.destroy
	
	this.initialize = function(items, specs){ 
		this.animations = {};
		this.items = items;
		this.specifications = specs;
		this.id = specs['id'] + s_GCounter;
		s_GCounter += 1;
		$("body").append("<div id='" + this.id + "'></div>" );
		this.drivebox = $("#" + this.id );
		this.drivebox.css( "left", window.pageXOffset );
		this.drivebox.css( "top", window.pageYOffset );
		this.drivebox.css( ' -moz-border-radius' , "25px");
		this.drivebox.css( 'border-radius' , "25px" );
		this.drivebox.css( "overflow", "visible" );
		this.engine = this.drivebox.playground( { 
			width : specs['mallwidth'] ,
			height : specs['mallheight']
		} );
		this.engine.css( ' -moz-border-radius' , "25px");
		this.engine.css( 'border-radius' , "25px" );
		this.engine.css( "overflow", "visible" );
		this.groups = {};
		for( var k = 0; k < items.length; k++ ){ 
			this.animations['item' + k] = new $.gameQuery.Animation( {
				imageURL : items[k]['tileset']
			} );
		}
		this.animations['arrow'] = new $.gameQuery.Animation({ 
			imageURL : PATH_NAME + "images/shopicons/arrow.png"
		});
		this.animations['smallclose'] = new $.gameQuery.Animation({ 
			imageURL : PATH_NAME + "images/shopicons/smallclose.png"
		});
		this.animations['locked'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/locked.png" 
		} );
		this.animations['vacant'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/vacant.png" 
		} );
		this.animations['close'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/Close.png" 
		} );
		this.animations['approve'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/approve.png" 
		} );
		this.animations['itemtile'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/itemicon.png" 
		} );
		this.animations['containerbg']  = new $.gameQuery.Animation( { 
			imageURL : specs['background']['image'] 
		} );
		$.playground().startGame();
	} // end this.initialize
	
	this.CreateContainer = function( ){ 
		var cspec = this.specifications;
		// Step 1: Creating the container
		var theGroup = this.engine.addGroup( this.id + "-shop-container", { 
			overflow : 'visible',
			width : cspec['width'] ,
			height : cspec['height'] ,
			posx : cspec['posx'] ,
			posy : cspec['posy'] 
		} ); 
		this.groups['container'] = theGroup;
		
		// Step 2: Setting the CSS
		theGroup.css( "z-index", cspec['posz'] );
		for( var k in cspec['background'] ){ 
			var bgcss = cspec['background'];
			theGroup.css( k, bgcss[k] );
		}
		return theGroup;		
	} // end this.CreateContainer
	
	
	this.CreateSpareTiles = function( type, free ){ 
		// Step 1: Setting the group
		var tspec = this.specifications;
		var theGroup;
		if( free ){ 
			var theGroup = $.playground().addGroup( this.id + "-shop-spare-set", { 
				overflow : 'visible',
				width : tspec['tile']['width'],
				height : tspec['tile']['height'],
				posx : tspec['posx'] ,
				posy : tspec['posy'] 
			} );
		} // end if free
		else{
			theGroup = this.engine.addGroup( this.id + "-shop-spare-set", { 
				overflow : 'visible',
				width : tspec['width'],
				height : tspec['height'],
				posx : tspec['posx'] ,
				posy : tspec['posy'] 
			} );
		} // end else
		this.groups['spare'] = theGroup;
		
		// Step 2: adding in the sprites
		var tile, tiles = [];
		for( var k = 0; k < DEFAULT_ROW_PER; k ++ ){ 
			var tilespec = tspec['tile'];
			theGroup.addSprite( this.id + "shop-spare-" + k , {
				animation : this.animations[type] ,
				width : tilespec['width'] ,
				height : tilespec['height']
			} );
			tile = $( "#" + this.id + "shop-spare-" + k );
			tiles.push( tile );
			
			// Step 2.5: Establish CSS
			theGroup.css( ' -moz-border-radius' , "25px");
			theGroup.css( 'border-radius' , "25px" );
			var tilecss = tspec['tile'];
			for( var j in tilecss ){ 
				tile.css( j, tilecss[j] );
			}

			// Step 3: adding in mouseover and click functions
			tile.mouseover( function(){ 
				tooltip.show( "Item out of stock!" );
			} );
			tile.mouseleave( function(){ 
				tooltip.hide();
			} );
		} // end for loop
		return tiles;
	}
	
	
	this.CreateTiles = function(free){ 
		// Step 1: Setting the group
		var tspec = this.specifications;
		var theGroup ;
		if( free ){
			this.engine.hide();
			theGroup = $.playground().addGroup(this.id + "-shop-tiles-set", { 
				overflow : 'visible',
				width : tspec['tile']['width'],
				height : tspec['tile']['height'],
				posx : tspec['posx'] ,
				posy : tspec['posy'] 
			} );
		} //end if free
		else{ 
			theGroup = this.engine.addGroup( this.id + "-shop-tiles-set", { 
				overflow : 'visible',
				width : tspec['width'],
				height : tspec['height'],
				posx : tspec['posx'] ,
				posy : tspec['posy'] 
			} );
		} // end else
		this.groups['tiles'] = theGroup;
		
		// Step 2: adding in the sprites
		var tile, tiles = [];
		for( var k = 0; k < this.items.length; k ++ ){ 
			var tilespec = tspec['tile'];
			theGroup.addSprite( this.id + "shop-tile-" + k , {
				animation : this.animations['item' + k] ,
				width : tilespec['width'] ,
				height : tilespec['height']
			} );
			tile = $( "#" + this.id + "shop-tile-" + k );
			tiles.push( tile );
			
			// Step 2.5: Establish CSS
			theGroup.css( ' -moz-border-radius' , "25px");
			theGroup.css( 'border-radius' , "25px" );
			var tilecss = tspec['tile'];
			for( var j in tilecss ){ 
				tile.css( j, tilecss[j] );
			}

			// Step 3: adding in mouseover and click functions
			tile.mouseover( (function(item){ 
				return function(){ 
					var help = "<p>Title: " + item['title'] + "</p>";
					help += "<p>Description: " + item['description'] + "</p>";
					help += "<p>Price: $" + item['price'] + "</p>";
					help += "<p>From: inGidio and friends</p>";
					tooltip.show( help );
				};
			} )(this.items[k]) );
			tile.mouseleave( function(){ 
				tooltip.hide();
			} );
			tile.click( ( function(generator, item, p){
				return function(e){ 
					var conform = generator.CreateConfirmForm( item );
					var posx = ( e.pageX % window.innerWidth - CONFIRMATION_WIDTH / 2);
					var posy = ( e.pageX % window.innerHeight - CONFIRMATION_HEIGHT / 2);
					conform.css( "left",  (posx > 0 ? posx : 0 ) + "px" );
					conform.css( "top", (posy > 0 ? posy : 0 ) + "px" );
				};
			} )(this, this.items[k], k) );
		} // end for loop
		return tiles;
	} // end this.CreateTiles
	
	this.CreateUI = function(){ 
		// Step 1: Setup the groups
		var gspec = this.specifications;
		var theGroup = this.engine.addGroup( this.id + "-shop-ui", { 
			overflow : 'visible',
			width : gspec['width'],
			height : gspec['height'] ,
			posx : gspec['posx'] ,
			posy : gspec['posy'] 
		} );
		this.groups['ui'] = theGroup;
		
		// Step 1.5: Setup the sprites
		theGroup.addSprite( this.id + "-shop-close", { 
			'width' : DEFAULT_BUTTON_WIDTH,
			'height' : DEFAULT_BUTTON_HEIGHT,
			'animation' : this.animations['close']
		} );
		theGroup.addSprite( this.id + "-shop-approve", { 
			'width' : DEFAULT_BUTTON_WIDTH,
			'height' : DEFAULT_BUTTON_HEIGHT,
			'animation' : this.animations['approve']
		} );
		theGroup.addSprite( this.id + "-shop-smallclose", { 
			'width' : SMALL_BUTTON_WIDTH,
			'height' : SMALL_BUTTON_HEIGHT,
			'animation' : this.animations['smallclose']
		} );
		theGroup.addSprite( this.id + "-shop-arrow", { 
			'width' : DEFAULT_ARROW_WIDTH,
			'height' : DEFAULT_ARROW_HEIGHT,
			'animation' : this.animations['arrow']
		} );
		var smallclose = $("#" + this.id + "-shop-smallclose");
		var arrow = $("#" + this.id + "-shop-arrow");
		var close = $("#" + this.id + "-shop-close");
		var approve = $("#" + this.id + "-shop-approve");
		
		// Step 2: Setup the callbacks
		arrow.mouseover( function(){ 
			tooltip.show( "Cycle through items" );
		} );
		arrow.mouseleave( function(){ 
			tooltip.hide();
		} );
		smallclose.mouseover( function(){ 
			tooltip.show( "Close shop" );
		} );
		smallclose.mouseleave( function(){ 
			tooltip.hide();
		} );
		close.mouseover( function(){ 
			tooltip.show( "Cancel" );
		} );
		close.mouseleave( function(){ 
			tooltip.hide();
		} );
		close.click( gspec['callbacks']['closeshop'] );
		
		approve.mouseover( function(){ 
			tooltip.show( "Confirm!" );
		} );
		approve.mouseleave( function(){ 
			tooltip.hide();
		} );
		smallclose.click( (function(shop){ 
			return function(){ 
				shop.destroy();
			};
		})(this) );
			
		// Step 2.5: Setup the CSS
		theGroup.css( ' -moz-border-radius' , "25px");
		theGroup.css( 'border-radius' , "25px" );
		var uicss = gspec['ui'];
		for( var j in uicss ){ 
			close.css(j, uicss[j]);
			approve.css(j, uicss[j]);
			smallclose.css(j, uicss[j]);
			arrow.css(j, uicss[j]);
		}
		smallclose.css( "left", ( gspec['width'] - SMALL_BUTTON_WIDTH / 2 )+ "px" );
		smallclose.css( "top",  0 + "px" );
		arrow.css( "left", (5 ) + "px" );
		arrow.css( "top", (( gspec['height'] - DEFAULT_ARROW_HEIGHT ) / 2 ) + "px" ); 
		
		// Step 3: Return this shit!
		return { 
			smallclose : smallclose ,
			arrow : arrow ,
			close : close, 
			approve : approve 
		};		// end return
	} // end this.CreateUI
	
	this.CreateConfirmForm = function(item){ 
		// Step 1: Setting up the containers
		var fspec = this.specifications;
		var theGroup = this.engine.addGroup( this.id + item['id'] + "-confirmation", { 
			'overflow' : 'visible',
			'width' : CONFIRMATION_WIDTH,
			'height' : CONFIRMATION_HEIGHT ,
			posx : fspec['posx'] ,
			posy : fspec['posy'] 
		} );
		if( this.groups['confirmation'] != undefined )
			this.groups['confirmation'].remove();
		this.groups['confirmation'] = theGroup;
		
		// Step 2: Adding in
		theGroup.addSprite( this.id + item['id'] + "-confirmation-text", { 
			'overflow' : 'visible',
			'width' : CONFIRMATION_WIDTH,
			'height' : CONFIRMATION_HEIGHT
		} ).
		addSprite( this.id + item['id'] + "-confirmation-yes", { 
			'overflow' : 'visible',
			'animation' : this.animations['approve'] ,
			'width' : fspec['ui']['buttonwidth'] ,
			'height' : fspec['ui']['buttonheight'] 
		} ).
		addSprite( this.id + item['id'] + "-confirmation-no", { 
			'overflow' : 'visible',
			'animation' : this.animations['close'] ,
			'width' : fspec['ui']['buttonwidth'] ,
			'height' : fspec['ui']['buttonheight'] 
		} );
		
		// Step 3: CSS and such
		theGroup.css( "z-index", DEFAULT_TILE_Z + 1 );
		var text = $("#" + this.id + item['id'] + "-confirmation-text" );
		var yes = $("#" + this.id + item['id'] + "-confirmation-yes" );
		var no = $( "#" + this.id + item['id'] + "-confirmation-no" );
		text.append( "<h3>Confirm Purchase</h3>" );
		yes.css( "top", 5 + "px" );
		yes.css( "left", 5 );
		no.css( "top", 5 + "px" );
		no.css( "left", ( 5 + fspec['ui']['buttonwidth'] ) + "px" );
		var fcss = fspec['background'];
		for( var k in fcss ){ 
			theGroup.css( k, fcss[k] );
		}
		
		// Step 4: Interactions
		yes.mouseover( function(){ 
			tooltip.show( "Confirm purchase" );
		} );
		yes.mouseleave( function(){
			tooltip.hide();
		} );
		yes.click( (function(generator){ 
			return function(e){ 
				theGroup.hide();
				var payform = generator.CreatePaymentForm( item );
				payform.css( "top", (fspec['height'] + 5) + "px" );
				var posx = ( e.pageX % window.innerWidth - fspec['form']['width'] / 2);
				payform.css( "left", (posx > 0 ? posx : 0 ) + "px" );
			};
		} )(this) );
		no.mouseover( function(){ 
			tooltip.show( "Cancel" );
		} );
		no.mouseleave( function(){ 
			tooltip.hide();
		} );
		no.click( function(){ 
			theGroup.remove();
		} );
		
		return theGroup;
	} // end this.CreateConfirmForm
	
	this.CreatePaymentForm = function(item){ 
		// Step 1: Setting up the containers
		var fspec = this.specifications;
		var theGroup = this.engine.addGroup( this.id + item['id'] + "-payment", { 
			'overflow' : 'visible',
			'width' : fspec['form']['width'],
			'height' : fspec['form']['height'] ,
			posx : fspec['posx'] ,
			posy : fspec['posy'] 
		} );
		if( this.groups['payment'] != undefined )
			this.groups['payment'].remove();
		this.groups['payment'] = theGroup;
		theGroup.css( "z-index", DEFAULT_TILE_Z + 1 );
		
		// Step 2: Adding in
		theGroup.addSprite( this.id + item['id'] + "-payment-form", { 
			'overflow' : 'visible',
			'width' : fspec['form']['width'],
			'height' : fspec['form']['height']
		} ).
		addSprite( this.id + item['id'] + "-payment-yes", { 
			'overflow' : 'visible',
			'animation' : this.animations['approve'] ,
			'width' : fspec['ui']['buttonwidth'] ,
			'height' : fspec['ui']['buttonheight'] 
		} ).
		addSprite( this.id + item['id'] + "-payment-no", { 
			'overflow' : 'visible',
			'animation' : this.animations['close'] ,
			'width' : fspec['ui']['buttonwidth'] ,
			'height' : fspec['ui']['buttonheight'] 
		} );
		
		// Step 3: gayQuery naming things
		var form = $("#" + this.id + item['id'] + "-payment-form" );
		var yes = $("#" + this.id + item['id'] + "-payment-yes" );
		var no = $( "#" + this.id + item['id'] + "-payment-no" );
		var myForm = InGidioForm.build([
			{
				'tag' : 'div',
				'content' : "Checkout!"
			},
			{
				'tag' : 'div',
				'content' : "Name: "
			},
			{ 
				'tag' : "input",
				'type' : "text",
				'id' : 'name' ,
				'placeholder' : 'ex. Jack Jackson'
			},
			{
				'tag' : 'div',
				'content' : "Credit Card Number: "
			},
			{ 
				'tag' : "input",
				'type' : "text",
				'id' : 'creditcardnumber' ,
				'placeholder' : 'ex. 1234 4567 8901 2345'
			},
			{
				'tag' : 'div',
				'content' : "CCV: "
			},
			{ 
				'tag' : "input",
				'type' : "text",
				'id' : 'ccv' ,
				'placeholder' : 'ex. 449'
			},
			{
				'tag' : 'div',
				'content' : "Expiration: "
			},
			{ 
				'tag' : "input",
				'type' : "number",
				'id' : 'expiremonth' ,
				'placeholder' : '1',
				'size' : 30,
				'style' : "width: 2em"
			},
			{ 
				'tag' : "input",
				'type' : "number",
				'id' : 'expireyear' ,
				'placeholder' : '2012',
				'size' : 30,
				'style' : "width: 3em"
			},
			{
				'tag' : 'div',
				'content' : "Email: "
			},
			{ 
				'tag' : "input",
				'type' : "text",
				'id' : 'email' ,
				'placeholder' : 'ex. example@ex.com'
			}
		]); // end InGidioForm.build
		
		// Step 3.5: Setting things
		form.append( myForm );
		yes.css( "top", (fspec['form']['height'] - fspec['ui']['buttonheight'] - 5) + "px" );
		yes.css( "left", 5 );
		no.css( "top", (fspec['form']['height'] - fspec['ui']['buttonheight'] - 5) + "px" );
		no.css( "left", ( 5 + fspec['ui']['buttonwidth'] ) + "px" );
		var fcss = fspec['form'];
		for( var k in fcss ){ 
			theGroup.css( k, fcss[k] );
		}
		
		// Step 4: Interactions
		yes.mouseover( function(){ 
			tooltip.show( "Confirm payment" );
		} );
		yes.mouseleave( function(){
			tooltip.hide();
		} );
		yes.click( (function(generator){ 
			return function(e){ 
				theGroup.hide();
				var position = { 
					'x' : e.pageX % window.innerWidth ,
					'y' : e.pageY % window.innerHeight
				};
				generator.CreateFlashMessage( "Purchase Pending...", position );
				var paydata = InGidioForm.get();
				paydata['url'] = document.url;
				fspec['callbacks']['buyitem']( item, paydata );
			};
		} )(this) );
		no.mouseover( function(){ 
			tooltip.show( "Cancel" );
		} );
		no.mouseleave( function(){ 
			tooltip.hide();
		} );
		no.click( function(){ 
			theGroup.remove();
		} );
		return theGroup;
	} // end CreatePaymentForm function
	
	this.CreateFlashMessage = function(message, position){ 
		// Step 1: Setting up the containers
		var fspec = this.specifications;
		var theGroup = this.engine.addGroup( this.id + "-flash", { 
			'overflow' : 'visible',
			'width' : fspec['flash']['width'],
			'height' : fspec['flash']['height'] ,
			posx : fspec['posx'] ,
			posy : fspec['posy'] 
		} );
		if( this.groups['flash'] != undefined )
			this.groups['flash'].remove();
		this.groups['flash'] = theGroup;		
		
		// Step 2: Adding the sprite
		theGroup.addSprite( this.id + "-flash-message", { 
			'width' : fspec['flash']['width'],
			'height' : fspec['flash']['height'],
			'posx': fspec['flash']['width'] / 2,
			'posy': fspec['flash']['height'] / 2
		} );
		var flash = $("#" + this.id + "-flash-message" );
		
		// Step 3: Apply CSS
		var flashcss = fspec['flash'];
		for( var k in flashcss ){ 
			flash.css( k, flashcss[k] );
		}
		
		// Step 4: Putting in the message
		flash.append( "<h4>" + message + "</h4>" );
		
		// Step 5: Setting setting the disapperance
		flash.show(2000, function(){ 
			flash.hide(3000, function(){ 
				theGroup.remove();
			} ); 
		} );
		
	} // end CreateFlashMessage function
}; //end Generator

