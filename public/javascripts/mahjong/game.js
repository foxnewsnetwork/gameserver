var MahjongGame = function(){ 
	this.players = [];
	this.board = new MahjongBoard();
	this.phase;
	
	// active player is the player whose turn it currently is
	this.activePlayer;
	
	// interactingPlayer is the player who is interacting with the game
	this.interactivePlayer;
	
	this.getactiveplayer = function(){ 
		return this.players[this.activePlayer];
	}
	
	this.initialize = function(){
		this.phase = PHASE_PREGAME;
		this.board = new MahjongBoard();
		this.players = [];
		this.activePlayer = PLAYER_EAST;
		for( var k = 0; k < PLAYER_COUNT; k++){ 
			this.players.push( new MahjongPlayer() );
		}
	} 
	
	this.newgame = function(){ 
		this.board.newboard();
		this.board.shuffle();

		for( var k = 0; k < this.players.length; k++ ){ 
			this.players[k].drawtiles( this.board, RULES_STARTING_TILE_COUNT );
		}
		this.phase = PHASE_INGAME;
		this.activePlayer = PLAYER_EAST;
	}
	
	this.gameloop = function(){
		// TODO: write me!
	} 
	
	this.tohtml = function(){ 
		var output = "<h1>Game State: </h1>";
		output += "<h5>Active Player: " + this.activePlayer + "</h5>";
		output += this.board.tohtml();
		for( var k = 0; k < this.players.length; k++ ){ 
			output += this.players[k].tohtml();
		}
		return output;
	}
	
	/************************
	* Gameplay API Section  *
	************************/
	// Returns a list of possible actions the given player may perform
	// player should be a number between 0 and 3
	this.GetPossibleActions = function(player){ 
		var actions = this.players[player].actions;
		var history = this.players[player].history;
		
		return actions;
	}
	
	// You must call this function before performing any player actions
	this.SetInteractivePlayer = function( player ){ 
		this.interactivePlayer = player;
	}
	
	// Call this to end your turn. The game begins your turn for you
	this.EndTurn = function( player ){ 
		this.activePlayer = ( this.activePlayer + 1 ) % PLAYER_COUNT;
	}
	
	// Draws a tile at the beginning of your turn
	this.DrawTile = function(){ 
		this.players[this.interactivePlayer].drawtile( this.board );
		
		// check ron for the player
		
		// check closed kan for the player
	}
	
	// Discard a tile if you've drawn 
	this.DiscardTile = function(tile){ 
		var faggot = this.players[this.interactivePlayer];
		var tossedtile = faggot.discardtile( this.board, tile );
		
		// check closed kan and pon for other players
		for( var fag, k = 0; k < PLAYER_COUNT; k++){ 
			if( k = this.interactivePlayer )
				continue;
			fag = this.players[k];
			fag.checkKan( tossedtile );
			fag.checkPon( tossedtile );
		}
		
		// check chi for the previous player
		var previous = this.players[(this.interactivePlayer + PLAYER_COUNT - 1 ) % PLAYER_COUNT];
		previous.checkChi( tossedtile );
	}
}
