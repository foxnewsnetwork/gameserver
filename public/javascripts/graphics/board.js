
var MahjongGraphicsBoard = function(){ 
	this.btileset = [];
	
	this.initialize = function(element){ 
		this.btileset = [];
		// Laying down the sprite locations placeholders
		var xpos, ypos, stuff;
		for( var k = 0; k < 5; k++ ){ 
			for( var j = 0; j < 9; j++){
				var temptile = new MahjongTileSprite();
				xpos = Math.floor(j/6) * TILE_WIDTH + X_BOARD;
				ypos = j%6 * TILE_HEIGHT + Y_BOARD;			
				//xpos = X_BOARD + k * TILE_WIDTH;
				//ypos = Y_BOARD + j * TILE_HEIGHT;
				//stuff = "btile-" + (k*9 + j);
				temptile.SetAt(xpos, ypos);
				this.btileset.push( temptile );
			}
		}
		return this;
	}
	
	// remember, json files
	this.draw = function( boardstate ){ 
		var discard = boardstate['freshTiles'];
		
		var x, xpos, ypos;
		for( x = 0; x < discard.length; x++ ){ 
			var mytile = discard[x];
			if( this.btileset[x] == undefined ){ 
				var atile = new MahjongTileSprite();
				xpos = Math.floor(x/6) * TILE_WIDTH + X_BOARD;
				ypos = x%6 * TILE_HEIGHT + Y_BOARD;
				atile.SetAt(xpos, ypos);
				atile.SetAs(mytile['suit'], mytile['value']);
				this.btileset.push( atile );
			}
			else{ 
				var atile = this.btileset[x];
				atile.SetAt(mytile['suit'], mytile['value']);
			}
		}
		
		while( x < this.btileset.length ){ 
			this.btileset[x].SetAs();
			x += 1;
		}
		
	}
}

