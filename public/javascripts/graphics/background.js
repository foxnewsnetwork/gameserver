var MahjongGraphicsBackground = function(){ 
	// Step 1: Getting the stuff
	this.bgtable;
	this.bgmenubar;
	
	this.initialize = function(element){
		this.bgtable = new $.gameQuery.Animation( { imageURL: IMAGE_PATH + "table.png" } );
		this.bgmenubar = new $.gameQuery.Animation( { imageURL: IMAGE_PATH + "menubar.png" } );	
		
		// Step 2: Creating the group and adding the sprites
		$.playground().addGroup( element + "-background", { 
			'width': GAME_WIDTH,
			'height': GAME_HEIGHT
		} ).addSprite( "bgtable", { 
			"animation": this.bgtable,
			'width': TABLE_WIDTH,
			'height': TABLE_HEIGHT,
			'posx': 0,
			'posy': 0
		} ).addSprite( "bgmenubar", { 
			"animation": this.bgmenubar,
			'width': MENUBAR_WIDTH,
			'height': MENUBAR_HEIGHT,
			'posx': X_MENUBAR,
			'posy': 0
		} ).end(); 
		$("#bgtable").css( "z-index", 0 );		
		$("#bgmenubar").css( "z-index", 0 );
		/*
		$("#bgmenubar").mouseover( function(){ tooltip.show( "You're a faggot" ); } );
		$("#bgmenubar").mouseout( function(){ tooltip.hide(); } );
		*/
		return this;
	}
}

