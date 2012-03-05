
var MahjongGraphicsBoard = function(){ 
	this.btileset = [];
	
	this.initialize = function(element){ 
		this.btileset = [];
		// Laying down the sprite locations placeholders
		var xpos, ypos, stuff;
		for( var k = 0; k < 5; k++ ){ 
			for( var j = 0; j < 9; j++){
				var temptile = new MahjongTileSprite();
				xpos = Math.floor((j +9*k)/TILE_PER_COL) * TILE_WIDTH  + X_BOARD;
				ypos = j%TILE_PER_COL * TILE_HEIGHT  + Y_BOARD; 
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
				xpos = Math.floor(x/TILE_PER_COL) * TILE_WIDTH + X_BOARD;
				//$("#debug").append( " xpos: " + xpos + " mathfloor " + Math.floor(x/6) );
				ypos = x%TILE_PER_COL * TILE_HEIGHT + Y_BOARD;
				atile.SetAt(xpos, ypos);
				atile.SetAs(mytile['suit'], mytile['value']);
				
				atile.SetCallback( 'mouseover', function(event){ 
					tooltip.show( tiletohtml(event['suit'], event['value'] ) );
				} );
				atile.SetCallback( 'mouseout', function(event){
					tooltip.hide();
				} );
				// atile.SetCallback( "click", function(event){ alert("you're a fag"); } );
				this.btileset.push( atile );
			}
			else{ 
				var atile = this.btileset[x];
				atile.SetAs(mytile['suit'], mytile['value']);
				atile.SetCallback( 'mouseover', function(event){ 
					tooltip.show( tiletohtml(event['suit'], event['value'] ) );
				} );
				atile.SetCallback( 'mouseout', function(event){
					tooltip.hide();
				} );
				// atile.SetCallback( "click", function(event){ alert("you're a fag"); } );
				//$("#debug").append( " xpos: " + xpos + " mathfloor " + Math.floor(x/6) );
			}
		}
		
		while( x < this.btileset.length ){ 
			this.btileset[x].destroy();
			x += 1;
		}
		
	}
}

