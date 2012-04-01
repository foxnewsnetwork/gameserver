/****************************
* Meta Generator Function       *
*****************************/
// Macros to make stuff
var metacounter = 0;
var MetaGenerator = function(){ 
	var id = DEFAULT_ELEMENT_ID;
	var dspec = { 
		width : DEFAULT_TILE_WIDTH ,
		height : DEFAULT_TILE_WIDTH
	};
	var animations = {};
	animations['close'] = new $.gameQuery.Animation( { 
		imageURL : PATH_NAME + "images/shopicons/Close.png" 
	} );
	animations['approve'] = new $.gameQuery.Animation( { 
		imageURL : PATH_NAME + "images/shopicons/approve.png" 
	} );
	
	return{ 
		MakeTile : function(item, specs){ 
			// Step 0: Initialize specs
			var spec = $.extend(true, {}, dspec, specs );
		
			// Step 1: Create the container
			$("body").append("<div id='" + id + metacounter"'></div>" );
			var drivebox = $("#" + id + metacounter);
			var engine = drivebox.playground({
				width : spec['width'] ,
				height : spec['height']
			});
			metacounter += 1;
			
			// Step 2: Create the animation
			var animation = new $.gameQuery.Animation( { 
				imageURL : item['tileset']
			} );
			
			// Step 3: Create the tileset
			var group = engine.addGroup( id + metacounter + "-group", { 
				width : spec['width'] ,
				height : spec['height']
			} );
			group.addSprite( id + metacounter + "-sprite", { 
				animation : animation ,
				width : spec['width'],
				height : spec['height'],
				posx : 0,
				posy : 0
			} );
			var sprite = $( "#" + id + metacounter + "-sprite" );
			
			// Step 4: Set callbacks
			sprite.mouseover( function(){ 
				var help = "<p>Title: " + item['title'] + "</p>";
					help += "<p>Description: " + item['description'] + "</p>";
					help += "<p>Price: $" + item['price'] + "</p>";
					help += "<p>From: inGidio and friends</p>";
					tooltip.show( help );
			} ); // end mouseover
			sprite.mouseleave( function(){ tooltip.hide(); } );
			sprite.click( function(){ 
				var confirm = MetaGenerator.MakeConfirmation( item, spec );	
				confirm.show();
			} ); // end click
			
			// Step 5: Return this shit
			return{ 
				drivebox : drivebox ,
				engine : engine ,
				group : group ,
				sprite : sprite ,
				item : item ,
				show : function(){ 
					engine.startGame();
					drivebox.show();
				} , // end show
				kill : function(){ 
					drivebox.hide();
					sprite.remove();
					group.remove();
					engine.remove();
					drivebox.remove();
				} // end kill
			}; // end return
		}, // end MakeTile
		MakeConfirmation : function(item, spec){ 
			// Step 0: Initialize specs
			var spec = $.extend(true, {}, dspec, specs );
		
			// Step 1: Create the container
			$("body").append("<div id='" + id + metacounter + "'></div>" );
			var drivebox = $("#" + id + metacounter + "-confirm");
			var engine = drivebox.playground({
				width : CONFIRMATION_WIDTH ,
				height : CONFIRMATION_HEIGHT
			});
			metacounter += 1;
			
			// Step 2: Create the group
			var group = engine.addGroup( id + metacounter + "-confirm-group", { 
				width : CONFIRMATION_WIDTH ,
				height : CONFIRMATION_HEIGHT
			} );
			group.addSprite( id + metacounter + "-confirm-sprite-close", { 
				animation : animations['close'] ,
				width : DEFAULT_BUTTON_WIDTH ,
				height : DEFAULT_BUTTON_HEIGHT
			} );
			group.addSprite( id + metacounter + "-confirm-sprite-approve", { 
				animation : animations['approve'] ,
				width : DEFAULT_BUTTON_WIDTH ,
				height : DEFAULT_BUTTON_HEIGHT
			} );
			var close = $("#" + id + metacounter + "-confirm-sprite-close" );
			var approve = $("#" + id + metacounter + "-confirm-sprite-approve" );
			
			// Step 3: Setting the callbacks
			close.mouseover( function(){ 
				tooltip.show( "Cancel Purchase" );
			} );
			close.mouseleave( function(){ 
				tooltip.hide();
			} );
			close.click( function(){ 
				drivebox.hide();
				drivebox.remove();
			} );
			approve.mouseover( function(){ 
				tooltip.show( "Confirm Purchase" );
			} );
			approve.mouseleave( function(){ 
				tooltip.hide();
			} );
			approve.click( function(){ 
				drivebox.hide();
				drivebox.remove();
				var payment = MetaGenerator.MakePayment(item, specs);
				payment.show();
			} );
			
			// Step 5: Return this shit
			return{ 
				drivebox : drivebox ,
				engine : engine ,
				group : group ,
				sprite : sprite ,
				item : item ,
				show : function(){ 
					engine.startGame();
					drivebox.show();
				} , // end show
				kill : function(){ 
					drivebox.hide();
					close.remove();
					approve.remove();
					group.remove();
					engine.remove();
					drivebox.remove();
				} // end kill
			}; // end return
		}// end MakeConfirmation
	}; // end return
}(); // end MetaGenerator
