var MahjongGameDC = function( ){ 
	// Device contexts
	this.boardDC = new MahjongBoardDC();
	this.playerDC = new MahjongPlayerDC();
	this.interfaceDC = new MahjongInterfaceDC();
	
	// Stuff the game must draw
	this.table = new Graphics.spr( IMAGE_PATH + "table.png", TABLE_WIDTH, TABLE_HEIGHT, 1, 0 );
	this.menubar = new Graphics.spr( IMAGE_PATH + "menubar.png", MENU_WIDTH, MENU_HEIGHT, 1, 0 );
	
	this.initialize = function(){ 
		this.boardDC.initialize();
//		this.playerDC.initialize();
//		this.interfaceDC.initialize();

	}
	this.draw = function( game ){ 
		// Step 1: Draw the two background dealies
		mibbuSetSpritePosition( this.table, X_TABLE, Y_TABLE, Z_TABLE );	
		mibbuSetSpritePosition( this.menubar, X_MENU, Y_MENU, Z_MENU );
		this.table.frame(0);
		this.table.speed(0);
		this.menubar.frame(0);
		this.menubar.speed(0);
				
		// Step 2: Draw the discard board
		this.boardDC.draw( game.board );
		
		// Step 3: Draw the players
		this.playerDC.draw( game.players[playerNumber] );
		
		// Step 4: Draw the UI
		// this.interfaceDC.draw( game );
	}
}

