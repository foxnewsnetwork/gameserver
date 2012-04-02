var MahjongPlayer = function(){ 
	this.hand;
	// manage the actions the player can do from the outside
	this.actions = { 
		'draw': false,
		'discard': false,
		'pon': false,
		'chi': false,
		'openkan': false,
		'closedkan': false,
		'riichi': false,
		'ron': false,
		'endturn': false,
		'chicall': false
	};
	// record what the last thing the player has done
	this.history;
	
	this.activationFlags = { 
		draw: 'true',
		discard: 'true'
	};
	
	// call this function on the player's turn
	this.activate = function(){ 
		this.actions['draw'] = true;
		this.actions['discard'] = false;
		this.actions['endturn'] = false;
		//this.actions['pon'] = false;
		//this.actions['chi'] = false;
		//this.actions['openkan'] = false;
	}
	//It is not the players turn anymore.
	this.deactivate = function(){ 
		this.actions['endturn'] = false;
		this.actions['draw'] = false;
		this.actions['discard'] = false;
	}
	//Recently pon'd or chi. Means you got to discard now
	this.recentPonOrChi = function(){
		this.actions['draw'] = false;
		this.actions['discard'] = true;
		this.actions['endturn'] = false;
		this.actions['pon'] = false;
		this.actions['chi'] = false;
		this.actions['chicall'] = false;
		this.actions['openkan'] = false;
	}
	//If another player has drawn, you lose certain actions
	this.otherPlayerDrew = function(){
		this.actions['pon'] = false;
		this.actions['chi'] = false;
		this.actions['openkan'] = false;
	}
	//
	this.chiCall = function(){
		this.actions['chicall'] = true;
		
	}
	// call this function to query possible actions of the player
	// calling this function also updates the actions list
	this.cando = function( action ){ 
		this.checkRon();
		this.checkKan();
		this.checkPon();
		if( action == undefined ){ 
			return this.actions;	
		}
		else { 
			return this.actions[action];
		}
	}
	//
	this.playerChoosingChi = function(){
		if(actions['chicall'])
		{}
		return this.actions['chicall'];
	}
	// chi is a flush of 3
	this.checkChi = function( tile ){ 
		var result = this.hand.checkChi(tile);
		if( result ){
			this.actions['chi'] = true;
		}
		else {
			this.actions['chi'] = false;
		}
		return result;	
	}
	
	// pon is 3 of a kind
	this.checkPon = function(tile){ 
		var result = this.hand.checkPon(tile);
		if( result ){
			this.actions['pon'] = true;
		}
		else {
			this.actions['pon'] = false;
		}
		return result;
	}
	
	// kan is 4 of a kind
	this.checkKan = function(tile){ 
		var result = this.hand.checkKan(tile);
		if( result ){
			if( tile == undefined )
				this.actions['closedkan'] = true;
			else
				this.actions['openkan'] = true;
		}
		else {
			if( tile == undefined )
				this.actions['closedkan'] = false;
			else
				this.actions['openkan'] = false;
		}
		return result;
	}
	
	// ron means to win the game
	this.checkRon = function(){ 
		
		var result = this.hand.checkRon();	
		if( result ){
			this.actions['ron'] = true;
		}
		else
			this.actions['ron'] = false;
		return result;
	}
	//can ron if other person discards as well
	this.checkRonFromDiscard = function(tile){ 
		var result = this.hand.checkRonFromDiscard(tile);	
		if( result )
			this.actions['ron'] = true;
		else
			this.actions['ron'] = false;
		return result;
	}
	
	//The player draws a tile.
	//If the player is a flower, immediately expose it and draw another.
	//Update actions accordingly
	this.drawtile = function(board){ 
		if( this.hand == undefined )
			this.hand = new MahjongHand();
		tileToAdd = this.hand.drawtile( board.freshTiles );
		while(tileToAdd.suit == 4)
			{
			this.hand.exposeTile(tileToAdd);
			tileToAdd = this.hand.drawtile( board.freshTiles);
			}
		
		this.actions['draw'] = false;
		this.actions['discard'] = true;
		this.actions['pon'] = false;
		this.actions['chi'] = false;
		this.actions['openkan'] = false;
	}
	
	//Throw out a tile and update actions accordingly
	this.discardtile = function(board, tile){ 
		if( this.hand == undefined )
			return;
		var theTile = this.hand.discardtile( board.discardTiles, tile );
		this.actions['discard'] = false;
		this.actions['endturn'] = true;
		return theTile;
	}
	
	//Draw the up to the limit.
	this.drawtiles = function( board, limit ){ 
		if( this.hand == undefined )
			this.hand = new MahjongHand();
		while( this.hand.hidden.length < limit && board.freshTiles.length > 0 ){ 
			this.drawtile( board );
		}
	}
	//A pon is called. 
	//Get a tile from the board
	//Then put it in our hand
	this.ponTile = function(board){
		ponTile = board.ponTile();
		this.hand.ponTile(ponTile);
	}
	
	//Chi is called
	//Get the tile from the board
	//Also yeah put it in our hand
	this.chiTile = function(board,tiles){
		chiTile = board.chiTile();
		result = this.hand.chiTile(chiTile,tiles);
		if(result)
			board.ponTile();
		return result;
	}
	//Kan is called
	//Get the kan'd tile fromt he board
	//Put in Hand!
	this.kanTile = function(board){ 
		kanTile = board.kanTile();
		this.hand.kanTile(kanTile);
		
	}
	
	//Sort your hand. The hand knows how to sort itself
	this.sorthand = function(){ 
		this.hand.sorthand();
	}
	
	//Convert the player state into a json
	this.tojson = function(){ 
		var data = { 
			'hand': this.hand.tojson(),
			'actions': this.actions
		};
		return data;
	}
	
	//Convert the json into the player state
	this.fromjson = function(data){ 
		this.hand = new MahjongHand();
		this.hand.fromjson(data['hand']);
		this.actions = data['actions'];
	}
	
	//Convert the player state into readable html
	this.tohtml = function(){ 
		var result = "<h1>Player: </h1>";
		result += this.hand.tohtml();
		return result;
	}
}

