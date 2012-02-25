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

