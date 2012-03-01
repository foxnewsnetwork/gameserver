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
		'endturn': false
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
	}
	
	this.deactivate = function(){ 
		this.actions['endturn'] = false;
		this.actions['draw'] = false;
		this.actions['discard'] = false;
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
		var result = this.hand.checkKan(tile);
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
		if( result )
			this.actions['ron'] = true;
		else
			this.actions['ron'] = false;
		return result;
	}
	
	this.drawtile = function(board){ 
		if( this.hand == undefined )
			this.hand = new MahjongHand();
		this.hand.drawtile( board.freshTiles );
		this.actions['draw'] = false;
		this.actions['discard'] = true;
		this.actions['pon'] = false;
		this.actions['chi'] = false;
		this.actions['openkan'] = false;
	}
	
	this.discardtile = function(board, tile){ 
		if( this.hand == undefined )
			return;
		var theTile = this.hand.discardtile( board.discardTiles, tile );
		this.actions['discard'] = false;
		this.actions['endturn'] = true;
		return theTile;
	}
	
	this.drawtiles = function( board, limit ){ 
		if( this.hand == undefined )
			this.hand = new MahjongHand();
		while( this.hand.hidden.length < limit && board.freshTiles.length > 0 ){ 
			this.drawtile( board );
		}
	}
	this.sorthand = function(){ 
		this.hand.sorthand();
	}
	
	this.tojson = function(){ 
		var data = { 
			'hand': this.hand.tojson(),
			'actions': this.actions
		};
		return data;
	}
	
	this.fromjson = function(data){ 
		this.hand = new MahjongHand();
		this.hand.fromjson(data['hand']);
		this.actions = data['actions'];
	}
	
	this.tohtml = function(){ 
		var result = "<h1>Player: </h1>";
		result += this.hand.tohtml();
		return result;
	}
}

