
var MahjongBoardDC = function(){ 
	this.tileDCs = [];
	
	this.initialize = function(){ 
		this.tileDCs = [];
		// We only ever show 36 of the most recently discard tiles
		for( var k = 0; k < 4; k++){ 
			for( var j = 0; j < 9; j++ ){
				var faggot = new MahjongTileDC();
				this.tileDCs.push( faggot );
				this.tileDCs[9*k + j].SetAs( { 
					'suit': k, 
					'value': j, 
					'note': (j % 4) 
				} );
			}
		}
		
	}
	
	this.draw = function( board ){ 
		if( board == undefined || discardboard == undefined )
			return;
		var discardboard = board.discard;
		var tile, x_pos, y_pos;
		for( var x = 0; x < discardboard.length; x++ ){ 
			tile = discardboard[x];
			if( tile == undefined )
				break;
			x_pos = X_DISCARD + 2 * tile.suit * TILE_WIDTH;
			y_pos = Y_DISCARD + ( tile.value % 5 )* TILE_HEIGHT;
			if( tile.value >  5 )
				x_pos += TILE_WIDTH;
			this.tileDCs[ 9*tile.suit + tile.value ].enable();
			this.tileDCs[ 9*tile.suit + tile.value ].draw( x_pos, y_pos, Z_TILES );
		}		
	}

}

