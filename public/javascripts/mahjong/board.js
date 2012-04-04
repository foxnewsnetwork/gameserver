var MahjongBoard = function(){ 
	this.discardTiles;
	this.freshTiles;
	
	//Create a new board. Create a complete set of tiles and put them
	// in the fresh tiles array
	this.newboard = function(){ 
		this.freshTiles = [];
		this.discardTiles = [];
		for( var j = 0; j < 5; j++) {
			if(j != 4){
			for( var k = 0; k < 9; k++ ) {
				
				if( j == 4 && k == 8 )
					continue;
				if( j == 3 && k > 6 )
					continue;
				//There are usually 4 of a type. So just push 4 times.
				this.freshTiles.push( new MahjongTiles(j, k) );
				this.freshTiles.push( new MahjongTiles(j, k) );
				this.freshTiles.push( new MahjongTiles(j, k) );
				this.freshTiles.push( new MahjongTiles(j, k) );
			}
			}
			// Here the tiles are flowers, and there are only 1 of each
			else
				for(var k = 0; k< 9;k++){
					this.freshTiles.push( new MahjongTiles(j, k) );	
				}
		}
		
	}
	//A pon was called. Remove a tile from the board
	this.ponTile = function(){
		tile = this.discardTiles.pop();
		return tile;
	}
	//A chi was called. Remove a tile from the board
	//Currently the same as ponTile. May want to refactor out in the future
	this.chiTile = function(){
		tile = this.discardTiles[this.discardTiles.length - 1];
		return tile;
	}
	//A chi was called. Remove a tile from the board
	//Currently the same as ponTile. May want to refactor out in the future
	this.kanTile = function(){
		tile = this.discardTiles.pop();
		return tile;
	}
	
	// shuffles the freshtiles
	this.shuffle = function(){ 
		var tempTile;
		var k;
		for( var j = 0; j < this.freshTiles.length; j++){
			k = Math.floor( Math.random() * 144 );
			var tempTile = this.freshTiles[k];
			this.freshTiles[k] = this.freshTiles[j];
			this.freshTiles[j] = tempTile; 
		}
	
	}
	//Convert the state of the board into a json
	this.tojson = function(){ 
		var data = { 
			'freshTiles': [],
			'discardTiles': []		
		}
		for( var x in this.freshTiles ){ 
			data['freshTiles'].push( this.freshTiles[x].tojson() );
		}
		for( var k in this.discardTiles ){ 
			data['discardTiles'].push( this.discardTiles[k].tojson() );
		} 
		return data;
	}	
	//Read a json and be able to recreate a boards state
	this.fromjson = function(data){ 
		this.freshTiles = [];
		this.discardTiles = [];
		for( var x in data['freshTiles'] ){
			this.freshTiles.push( new MahjongTiles() );
			this.freshTiles[x].fromjson(data['freshTiles'][x])
		}
		for( var x in data['discardTiles'] ){
			this.discardTiles.push( new MahjongTiles() );
			this.discardTiles[x].fromjson( data['discardTiles'] );
		}
	}
	//Convert board state into readable html.
	this.tohtml = function(){ 
		var shtml = "<h1>Board</h1><h3>Fresh Tiles: </h3>";
		for( var x in this.freshTiles ){ 
			shtml += this.freshTiles[x].tohtml();
		}
		shtml += "<h3>Discarded Tiles</h3>";
		for( var y in this.discardTiles ){ 
			shtml += this.discardTiles[y].tohtml();
		}
		return shtml;
	}
}

