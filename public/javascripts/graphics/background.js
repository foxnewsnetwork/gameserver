var MahjongGraphicsBackground = function(){ 
	// Step 1: Getting the stuff
	this.bgtable = new $.gameQuery.Animation( { imageURL: IMAGE_PATH + "table.png" } );
	this.bgmenubar = new $.gameQuery.Animation( { imageURL: IMAGE_PATH + "menubar.png" } );
	
	this.initialize = function(element){
		
		
		// Step 2: Creating the group
		$.playground().addGroup( element + "-background", { 
			'width': GAME_WIDTH,
			'height': GAME_HEIGHT
		} );
		
		// Step 3: Adding in the sprites
		$("#" + element + "-background").addSprite( "bgtable", { 
			"animation": this.bgtable,
			'width': TABLE_WIDTH,
			'height': TABLE_HEIGHT,
			'posx': 0,
			'posy': 0
		} ); 
		
		$("#" + element + "-background").addSprite( "bgmenubar", { 
			"animation": this.bgmenubar,
			'width': MENUBAR_WIDTH,
			'height': MENUBAR_HEIGHT,
			'posx': X_MENUBAR
			'posy': 0
		} ); 
		
		return this;
	}
}

