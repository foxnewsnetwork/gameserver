var MahJongTiles = function(s,v,n){
	this.suit = s;
	this.value = v;
	this.note = n;
	this.sval = function(){ 
		return this.note + this.value * 10 + this.suit * 100;
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
	this.tohtml = function(){ 
		var result = "";
		switch( this.suit ){ 
			case 0 :
				result += " | Circle " + this.value + " | ";
				break;
			case 1 :
				result += " | Sticks " + this.value + " | ";
				break;
			case 2 :
				result += " | Characters " + this.value + " | ";
				break;
			default :
				switch( this.value ){ 
					case 0:
						result += " | North | ";
						break;
					case 1:
						result += " | South | ";
						break;
					case 2:
						result += " | West | ";
						break;
					case 3: 
						result += " | East | ";
						break;
					case 4: 
						result += " | Zhong | ";
						break;
					case 5: 
						result += " | Fa | ";
						break;
					case 6: 
						result += " | Blank | ";
						break;
					case 7:
						switch( this.note ){ 
							case 0:
								result += " | Plum | ";
								break;
							case 1:
								result += " | Orchid | ";
								break;
							case 2:
								result += " | Chrysanthermum | ";
								break;
							case 3:
								result += " | Bamboo | ";
								break;
						}
						break;
					case 8:
						switch( this.note ){ 
							case 0:
								result += " | Spring | ";
								break;
							case 1:
								result += " | Summer | ";
								break;
							case 2:
								result += " | Autumn | ";
								break;
							case 3:
								result += " | Winter | ";
								break;
						}
						break;
				}
				break;
		}
		return result;
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
			k = Math.floor( Math.random() * 144 );
			var tempTile = this.freshTiles[k];
			this.freshTiles[k] = this.freshTiles[j];
			this.freshTiles[j] = tempTile; 
		}
	}
	
	this.tohtml = function(){ 
		var shtml = "<h1>Board</h1>";
		for( var x in this.freshTiles ){ 
			shtml += this.freshTiles[x].tohtml();
		}
		return shtml;
	}
}

var MahjongHand = function(){ 
	this.hidden = [];
	this.exposed = [];
	
	this.drawtile = function( tiles ){ 
		this.hidden.push( tiles.pop() );
	}
	
	this.sorthand = function(){ 
		this.hidden.sort( function(a,b){ 
			return a.sval() - b.sval();
		} );
	}
	
	this.tohtml = function(){ 
		var result = "<h4>Hidden Hand: </h4>";
		for( var x in this.hidden ){ 
			result += this.hidden[x].tohtml();
		}
		result += "<h4>Exposed Hand: </h4>";
		for( var x in this.exposed ){ 
			result += this.exposed[x].tohtml();
		}
		return result;
	}
}

var MahjongPlayer = function(){ 
	this.hand;
	
	this.drawtile = function(board){ 
		if( this.hand == undefined )
			this.hand = new MahjongHand();
		this.hand.drawtile( board.freshTiles );
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

/*********************
* Mahjong Constants    *
**********************/
var PLAYER_COUNT = 4,
	PLAYER_NORTH = 0,
	PLAYER_SOUTH = 1,
	PLAYER_WEST = 2,
	PLAYER_EAST = 3,
	PHASE_PREGAME = 0,
	PHASE_INGAME = 1,
	PHASE_ENDGAME = 2,
	RULES_STARTING_TILE_COUNT = 13;

var MahjongGame = function(){ 
	this.players = [];
	this.board;
	this.phase;
	this.activePlayer;
	
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
	
	this.tohtml = function(){ 
		var output = "<h1>Game State: </h1>";
		output += "<h5>Active Player: " + this.activePlayer + "</h5>";
		output += board.tohtml();
		for( var k = 0; k < this.players.length; k++ ){ 
			output += this.players[k].tohtml();
		}
		return output;
	}
}
