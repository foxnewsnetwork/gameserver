var MahjongBoard = function(){ 
	this.discardTiles;
	this.freshTiles;
	
	this.newboard = function(){ 
		this.freshTiles = [];
		this.discardTiles = [];
		for( var j = 0; j < 5; j++) {
			for( var k = 0; k < 9; k++ ) {
				if( j == 4 && k == 8 )
					continue;
				if( j == 3 && k > 6 )
					continue;
				this.freshTiles.push( new MahjongTiles(j, k) );
				this.freshTiles.push( new MahjongTiles(j, k) );
				this.freshTiles.push( new MahjongTiles(j, k) );
				this.freshTiles.push( new MahjongTiles(j, k) );
			}
		}
		
	}
	
	// shuffles the frestiles
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

