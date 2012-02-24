var MahjongPlayer = function(){ 
	this.hand;
	this.activationFlags = { 
		draw: 'true',
		discard: 'true'
	};
	
	// call this function on the player's turn
	this.activate = function(){ 
		this.activationFlags['draw'] = false;
		this.activationFlags['discard'] = false;
	}
	
	// call this function to query possible actions of the player
	this.cando = function( action ){ 
		if(action == undefined){
			var actions = []; 
			if( !this.activationFlags['draw'] ){
				actions.push( 'draw' );
			}
			if( !this.activationFlags['discard'] ){
				actions.push( 'discard' );
			}
			
			return actions;
		}
		switch( action ){ 
			case 'draw':
				return !this.activationFlags['draw'];
			case 'discard':
				return !this.activationFlags['discard'];
			case 'ron':
				return this.checkRon();
			default:
				return false;
		}
	}
	
	this.checkRon = function(){ 
		return this.hand.checkRon();	
	}
	
	this.drawtile = function(board){ 
		if( this.hand == undefined )
			this.hand = new MahjongHand();
		this.hand.drawtile( board.freshTiles );
		this.activationFlags['draw'] = true;
	}
	
	this.discardtile = function(board, tile){ 
		if( this.hand == undefined )
			return;
		this.hand.discardtile( board.discardTiles, tile );
		this.activationFlags['discard'] = true;
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
	
	this.tohtml = function(){ 
		var result = "<h1>Player: </h1>";
		result += this.hand.tohtml();
		return result;
	}
}

