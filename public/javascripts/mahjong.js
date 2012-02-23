/************************
* Mahjong Constants           *
*************************/
var ACTION_DISCARD = 0,
	ACTION_PON = 1,
	ACTION_CHI = 2,
	ACTION_KAN = 3,
	ACTION_RON = 4,
	ACTION_RIICHI = 5;
	ACTION_DRAW = 6;

/************************
* Mahjong Game                    *
*************************/
var Mahjong = function(){ 
	this.players = [];
	this.board;
	this.roundCount;
	this.activePlayer;
	
	this.newgame = function(){ 
		this.players = [];
		this.players.push( new MahjongPlayer() );
		this.players.push( new MahjongPlayer() );
		this.players.push( new MahjongPlayer() );
		this.players.push( new MahjongPlayer() );
		
		for( var x in this.players ){
			players[x].newround();
		}
		
		this.board = new MahjongBoard();
		this.board.initialize();
		this.roundCount = 0;
		this.activePlayer = 0;
	}
	
	this.nextturn = function(){
		this.players[this.activePlayer].turn(this.board);
		this.activePlayer = ( this.activePlayer + 1 ) % 4
	}
	
	this.gameover = function(){ 
		
	}
}

var MahjongPlayer = function(){ 
	this.points
	this.hand;
	this.exposed = [];
	this.userdata;
	
	// internals
	this.riichiFlag = false;
	this.ronFlag = false;
	this.kanFlag = false;
	
	// Game functions	
	this.newgame = function(){ 
	
	}
	
	this.newround = function(){ 
		this.hand = [];
		this.turnAction = 0;
		this.riichiFlag = false;
		this.turnAction = false;
		this.kanFlag = false;
	}
	
	this.deinitialize = function(){ 
	
	}
	
	// Player actions
	// riichi is the status when players are ready to win
	this.riichi = function( board ){ 
		this.riichiFlag = true;
	}
	// pon is the making of a 
	this.pon = function( board ){ 
		// Step 1: check if a pon is possible
		var potentialPon = board.discardTiles[board.discardTiles.length - 1];
		var doublet = this.hand.checkPon( potentialPon );
		if( doublet != false ){ 
			// put the tiles into the correct place
			this.exposed.push( this.hand.tiles[doublet[0]] );
			this.exposed.push( this.hand.tiles[doublet[1]] );
			this.exposed.push( potentialPon );
			
			// get rid of them from the hand
			
		}
		else{
		
		}
		
	}
	this.chi = function( board ){ 
		
	}
	this.ron = function( ){ 
		return this.hand.GetValue();
	}
	this.kan = function( ){ 
		
	}
}

var MahjongBoard = function(){ 
	this.discardTiles;
	this.freshTiles;
	
	this.newboard = function(){ 
		this.freshTiles = [];
		this.discardTiles = [];
		for( var j = 0; j < 4; j++) {
			for( var k = 0; k < 9; k++ ) {
				this.freshTiles.push( new MahJongTiles(j, k, 0) );
				this.freshTiles.push( new MahJongTiles(j, k, 1) );
				this.freshTiles.push( new MahJongTiles(j, k, 2) );
				this.freshTiles.push( new MahJongTiles(j, k, 3) );
			}
		}
	}
	
	// shuffles the frestiles
	this.shuffle = function(){ 
		var tempTile;
		var k;
		for( var j = 0; j < 144; j++){
			k = floor( Math.random() * 144 );
			var tempTile = this.freshTiles[k];
			this.freshTiles[k] = this.freshTiles[j];
			this.freshTiles[j] = tempTile; 
		}
	}
}

var MahjongHand = function)(){ 
	this.tiles;	
	
	this.drawTile = function(tile)	{
		this.tiles.push( tile );
	}
	
	this.draw4 = function(t1, t2, t3, t4){ 
		this.drawTile(t1);
		this.drawTile(t2);
		this.drawTile(t3);
		this.drawTile(t4);
	}
	
	// Checks for 2 of the same the row
	this.checkPon = function( tile ){ 
		var counter = 0;
		var doublet = [];
		for( var x in this.tiles ){ 
			if( this.tiles[x].suit == tile.suit && this.tiles[x].value == tile.value ){
				counter += 1;
				doublet.push(x);
			}
		}
		if( counter >= 2 ) 
			return doublet;
		else
			return false;
			
		// TODO: make it return the a hash of the possibilities
	}
	
	// checks for consecutive tiles
	this.checkChi = function( tile ){ 
		var tileBefore = -1, tile2Before = -1;
		var tileAfter = -1, tile2After = -1;
		var result = {};
		
		for( var x in this.tiles ){ 
			if( this.tiles[x].suit == tile.suit ){ 
				if( this.tiles[x].value == tile.value + 1 )
					tileAfter = x;
				if( this.tiles[x].value == tile.value - 1 )
					tileBefore = x;
				if( this.tiles[x].value == tile.value - 2 )
					tile2Before = x;
				if( this.tiles[x].value == tile.value + 2 )
					tile2After = x;
			}
		}
		
		if( tileAfter >= 0 && tileBefore >= 0 )
			result[ 'middle' ] = [ tileAfter, tileBefore ];
		if( tileAfter  >= 0 && tile2After  >= 0 )
			result[ 'begin' ] = [tileAfter, tile2After ];
		if( tileBefore  >= 0 && tile2Before  >= 0 )
			result[ 'end' ] = [tileBefore, tile2Before ];
		return result;
	}
}

var MahJongTiles = function(s,v,n){
	this.suit = s;
	this.value = v;
	this.note = n;
	this.sval = function(){ 
		return this.note + this.value * 4 + this.suit * 9;
	}
	/*
	suit @ 0 => circles
	suit @ 1 => tiles
	suit @ 2 => characters
	suit @ 3 => misc
		0 => north
		1 => south
		2 => west
		3 => east
		4 => middle
		5 => fa
		6 => blank
		7 => flower
			0 => plum
			1 => orchid
			2 => chrysanthermum
			3 => bamboo
		8 => season
			0 => spring
			1 => summer
			2 => autumn
			3 => winter
	*/
}
