var MahjongHand = function(){ 
	this.hidden = [];
	this.exposed = [];
	
	
	this.drawtile = function( tiles ){ 
		this.hidden.push( tiles.pop() );
		this.sorthand();
	}
	
	this.discardtile = function(tiles, tile){ 
		var mytile = this.hidden.splice(tile, 1);
		tiles.push(mytile);
		this.sorthand();
		return mytile;
	}
	
	this.sorthand = function(){ 
		this.hidden.sort( function(a,b){ 
			return a.sval() - b.sval();
		} );
		this.exposed.sort( function(a,b){
			return a.sval() - b.sval();
		} );
	}
	
	// chi is a 3 flush
	this.checkChi = function(tile){ 
		var counter = 0;
		for( var k = 0; k < this.hidden.length - 2; k++ ){ 
			if( TileFlush(tile, this.hidden[k], this.hidden[k+1] ) )
				return true;
			if( TileFlush(this.hidden[k], tile, this.hidden[k+1] ) )
				return true;
			if( TileFlush(this.hidden[k], this.hidden[k+1], tile ) )
				return true;
		}
		return false;
	}
	
	// pon is 3 in a roll
	this.checkPon = function(tile){ 
		var counter = 0;
		for( var x in this.hidden ){ 
			if( TileEqual( tile, this.hidden[x] ) )
				counter += 1;
			if( counter == 2 )
				return true;
		}
		return false;
	}
	
	// kan is 4 in a roll
	// calling it with no tiles checks for existence of 4-in-a-rolls
	// keep in mind the hand is sorted for a reason
	this.checkKan = function(tile){ 
		if( tile == undefined ){ 
			var lolcat = 0;
			for( var x = 0; x < this.hidden.length - 1; k++ ){ 
				if( TileEqual(this.hidden[x], this.hidden[x+1]) )
					lolcat += 1;
				else
					lolcat = 0;
				if( counter == 4 )
					return true;
			}
			return false;
		}
		
		var counter = 0;
		for( var x in this.hidden ){ 
			if( TileEqual( tile, this.hidden[x] ) )
				counter += 1;
			if( counter == 3 )
				return true;
		}
		return false;
	}
	
	this.checkRon = function(){ 
		var singleCount = 0, doubleCount = 0, tripleCount = 0, quadCount = 0, straightCount = 0;
		var x = 0, y = 0;
		while( x < this.hidden.length ){ 
			y = 0;
			singleCount += 1;
			y += 1;
			if( TileEqual( this.hidden[x], this.hidden[x+1] ) ){ 
				singleCount += -1;
				doubleCount += 1;
				y += 1;
				if( TileEqual( this.hidden[x], this.hidden[x+1], this.hidden[x+2] ) ){ 
					doubleCount += -1;
					tripleCount += 1;
					y += 1;
					if( TileEqual(this.hidden[x], this.hidden[x+3] ) ){
						quadCount += 1;
					}
				}
				continue;
			}
			if( TileFlush(this.hidden[x], this.hidden[x+1], this.hidden[x+2]) ) { 
				straightCount += 1;
				singleCount += -1;
				y += 2;
				continue
			}
			x += y;
			if( singleCount - quadCount > 0 )
				return false;
			if( doubleCount > 1 )
				return false;
		}
		if( doubleCount == 1 )
			if( tripleCount + straightCount == 4 )
				return true;
		return false;
		// TODO: get this function to return the point value of the hand when true
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

