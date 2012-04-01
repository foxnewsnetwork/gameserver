/**********************************
*  Independent tiles for normal mode *
**********************************/

var s_IndependentTileId = 0;
var IndependentTile = function(){ 
	// members
	this.specs = { 
		'width' : DEFAULT_TILE_WIDTH,
		'height' : DEFAULT_TILE_HEIGHT
	};
	this.id = DEFAULT_ELEMENT_ID + Math.floor(Math.random() * 1000) + "-" + s_IndependentTileId;
	this.drivebox;
	this.engine;
	this.group;
	this.sprite;
	this.animation;
	// Delegates
	this.click = function(item){ 
		return function(e){
			var confirm = new IndependentForm();
			confirm.initialize( item, { 
				type : "confirmation"
			} );
			confirm.moveto( { x : e.pageX, y : e.pageY } );
			confirm.show();
		} // end return
	}; // end click
	this.mouseover = function(item){ 
		return function(e){ 
			var help = "<p>Title: " + item['title'] + "</p>";
			help += "<p>Description: " + item['description'] + "</p>";
			help += "<p>Price: $" + item['price'] + "</p>";
			help += "<p>From: inGidio and friends</p>";
			tooltip.show( help );
		}; // end return
	}; // end mouseover
	this.mouseleave = function(item){ 
		return function(e){ 
			tooltip.hide();
		}; // end return
	}; // end mouseleave
	
	this.show = function(){ 
		this.drivebox.show();
	} // end show
	
	// methods
	this.initialize = function(item, specs){ 
		$.extend( this.specs, specs );
		$("body").append("<div id='" + this.id + "'></div>" );
		this.drivebox = $("#" + this.id );
		this.engine = this.drivebox.playground( {
			width : this.specs['width'] ,
			height : this.specs['height']
		} );
		this.animation = new $.gameQuery.Animation( { imageURL : item['tileset'] } );
		this.group = this.engine.addGroup( this.id + "-group", { 
			'width' : this.specs['width'],
			'height' : this.specs['height']
		} ).
		addSprite( this.id + "-sprite", { 
			animation : this.animation ,
			width : this.specs['width'],
			height : this.specs['height']
		} );
		this.sprite = $("#" + this.id + "-sprite" );
		s_IndependentTileId += 1;
		
		this.sprite.mouseover( this.mouseover(item, this) );
		this.sprite.mouseleave( this.mouseleave(item, this) );
		this.sprite.click( this.click(item, this) );
		
		this.drivebox.hide();	
	} // end initialize
	this.move = function( position ){ 
	
	} // end move
	this.destroy = function(){ 
	
	} // end destroy
} // end IndependentTile
