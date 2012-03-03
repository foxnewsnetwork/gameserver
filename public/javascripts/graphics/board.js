
var MahjongGraphicsBoard = function(){ 
	this.btileset = CreateSet();
	this.bgroup;
	
	this.initialize = function(element){ 
		this.bgroup = $.playground().addGroup( element + "-board", { 
			'width': BOARD_WIDTH,
			'height': BOARD_HEIGHT,
			'posx': X_BOARD,
			'posy': Y_BOARD
		} );
		// Laying down the sprite locations placeholders
		var xpos, ypos;
		for( var k = 0; k < 5; k++ ){ 
			for( var j = 0; j < 9; j++){
				xpos = X_BOARD + (2 + ( j > 4 ) )* k * TILE_WIDTH;
				ypos =  Y_BOARD + (j % 5) * TILE_HEIGHT;
				this.bgroup.addSprite( "btile-" + (k*9 + j), {
					'width': TILE_WIDTH ,
					'height': TILE_HEIGHT ,
					'posx': xpos,
					'poxy': ypos
				} ) ;
			}
		}
		return this;
	}
	
	// remember, json files
	this.draw = function( boardstate ){ 
		var discard = boardstate['discardtiles'];
		// First we null all the animations
		for( var j = 0; j < this.btileset.length; j++){ 
			$( "#btile-" + k ).setAnimation();
		}
		// Then we do the new animations
		for( var k = 0; k < discard.length; k++ ){ 
			$( "#btile-" + k ).setAnimation( this.btileset[k] );
		}
	}
}

