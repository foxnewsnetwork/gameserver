var MahjongGame = function(){ 
	this.players = [];
	this.board = new MahjongBoard();
	this.phase;
	this.activePlayer;
	
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
	
	// Returns a list of possible actions the given player may perform
	// player should be a number between 0 and 3
	this.GetPossibleActions = function(player){ 
			var actions = {};
			
			// We deal with the case when it's the player's turn
			if(this.activePlayer == player){ 
				
			}
	}
}
