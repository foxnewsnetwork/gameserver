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
	}
	
	this.sorthand = function(){ 
		this.hidden.sort( function(a,b){ 
			return a.sval() - b.sval();
		} );
		this.exposed.sort( function(a,b){
			return a.sval() - b.sval();
		} );
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

