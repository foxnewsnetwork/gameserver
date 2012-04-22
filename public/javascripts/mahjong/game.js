var MahjongGame = function(){ 
	this.players = [];
	this.board = new MahjongBoard();
	this.phase;
	this.begun;
	this.begun = false;

	// active player is the player whose turn it currently is
	this.activePlayer;
	
	// interactingPlayer is the player who is interacting with the game
	this.interactivePlayer;
	
	//Returns the Player object that is currently active.
	this.getactiveplayer = function(){ 
		return this.players[this.activePlayer];
	}
	
	//Create a new Game. Initialize players and a board.
	this.initialize = function(){
		this.phase = PHASE_PREGAME;
		this.board = new MahjongBoard();
		this.players = [];
		this.activePlayer = PLAYER_EAST;
		for( var k = 0; k < PLAYER_COUNT; k++){ 
			this.players.push( new MahjongPlayer() );
		}
	} 
	
	//Begin the actual game.
	//This means having players draw the correct amount of tiles
	//as well as choosing whose turn it is
	this.newgame = function(){ 
		this.board.newboard();
		this.board.shuffle();
		this.begun = true;
		for( var k = 0; k < this.players.length; k++ ){ 
			this.players[k].drawtiles( this.board, RULES_STARTING_TILE_COUNT );
		}
		this.phase = PHASE_INGAME;
		this.activePlayer = PLAYER_EAST;
		for( var xxx in this.players ){ 
			if( xxx == this.activePlayer )
				this.players[this.activePlayer].activate();
			else
				this.players[xxx].deactivate();
		}
	}
	
	//Convert the game state into a json
	this.tojson = function(){
		var data = {
			'board': this.board.tojson(),
			'players': [],
			'activePlayer': this.activePlayer,
			'interactivePlayer': this.interactivePlayer
		}
		for( var x in this.players ){ 
			data['players'].push( this.players[x].tojson() );
		}
		return data;
	} 
	
	//Convert a json file into the current game state.
	this.fromjson = function( data ){ 
		this.initialize();
		this.board.fromjson(data['board']);
		for( var x in this.players )
			this.players[x].fromjson( data['players'][x] );
		this.activePlayer = data['activePlayer'];
		this.interactivePlayer = data['interactivePlayer']; 
	}
	
	//Convert the game state into readable html
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
		if( player == undefined ){ 
			var actions = this.players[this.interactivePlayer].actions;
			var history = this.players[this.interactivePlayer].history;
		}
		else{
			var actions = this.players[player].actions;
			var history = this.players[player].history;
		}
		
		return actions;
	}
	
	this.playerChoosingChi = function(){
		return this.players[this.interactivePlayer].playerChoosingChi();
	}
	// You must call this function before performing any player actions
	this.SetInteractivePlayer = function( player ){ 
		this.interactivePlayer = player;
	}
	
	// Call this to end your turn. The game begins your turn for you
	this.EndTurn = function(player){ 
		this.players[this.activePlayer].deactivate();
		   
		this.activePlayer = ( parseInt(this.activePlayer) + 1 ) % PLAYER_COUNT;
		this.players[this.activePlayer].activate();
	}
	
	// Draws a tile at the beginning of your turn
	this.DrawTile = function(player){ 
		this.SetInteractivePlayer(player);
		this.players[this.interactivePlayer].drawtile( this.board );
		for( var k = 0; k < PLAYER_COUNT; k++){ 
			
			this.players[k].otherPlayerDrew();
			
			
		}
		// check ron for the player
		this.players[this.interactivePlayer].checkRon();
		// check closed kan for the player
	}
	
	// Discard a tile if you've drawn 
	//After discarding, other players should check if they can perform
	//normal mahjong actions
	this.DiscardTile = function(player,tile){ 
		if(tile != undefined){
			this.SetInteractivePlayer(player);
			var faggot = this.players[this.interactivePlayer];
			var tossedtile = faggot.discardtile( this.board, tile );
			// check closed kan and pon for other players
			var fag;
			for( var k = 0; k < PLAYER_COUNT; k++){ 
				if( k == this.interactivePlayer )
					continue;
				fag = this.players[k];
				kanAvailable = fag.checkKan( tossedtile );
				ponAvailable = fag.checkPon( tossedtile );
			
			//Recently checked and I don't think you can ron from any discard.
			//You have to declare it only if it's a legit draw.
			//fag.checkRonFromDiscard(tossedtile);
			}
			// check chi for the previous player
		 
			var previous = this.players[(parseInt(this.interactivePlayer) + 1 ) % PLAYER_COUNT];
			if(((parseInt(this.interactivePlayer) + 1 ) % PLAYER_COUNT) == 3)
				previous.checkChi( tossedtile );
		}
	}
	
	//A player called a Pon.
	//It is now the turn of the player who called Pon.
	// They also get to pon a tile, duh!
	this.Pon = function(player){
		this.players[this.activePlayer].deactivate();
		this.SetInteractivePlayer(player);
		currentPlayer = this.players[this.interactivePlayer];
		currentPlayer.ponTile(this.board);
		
		this.activePlayer = this.interactivePlayer;
		this.players[this.interactivePlayer].checkRon();
		this.players[this.activePlayer].recentPonOrChi();

	}
	
	//A player called a Chi
	//It is now the turn of the player who called Chi.
	//Also they get the tile.
	this.Chi = function(player){
		this.players[this.activePlayer].deactivate();
		this.SetInteractivePlayer(player);
		currentPlayer = this.players[this.interactivePlayer];
		//currentPlayer.chiTile(this.board);
		currentPlayer.chiCall();
		this.activePlayer = this.interactivePlayer;
		

	}
	this.commitChi = function(player,tiles){
		if(tile != undefined){
			this.SetInteractivePlayer(player);
			currentPlayer = this.players[this.interactivePlayer];
			result = currentPlayer.chiTile(this.board,tiles);
			
		if(result)
		this.players[this.activePlayer].recentPonOrChi();

		this.players[this.interactivePlayer].checkRon();
		}
	}
	//A player called Kan
	//Similar to Pon and Chi.
	this.Kan = function(player){
		this.players[this.activePlayer].deactivate();
		this.SetInteractivePlayer(player);
		currentPlayer = this.players[this.interactivePlayer];
		currentPlayer.kanTile(this.board);
		
		this.activePlayer = this.interactivePlayer;
		
		this.players[this.activePlayer].activate();

	}
	//A player called Ron which means they win the game
	this.Ron = function(player){
		this.players[this.activePlayer].deactivate();
		this.SetInteractivePlayer(player);
		currentPlayer = this.players[this.interactivePlayer];
		
	}
	this.playerJoined = function(){
		
	}
}
