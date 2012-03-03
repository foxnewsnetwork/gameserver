var MahjongPlayerDC = function(){
	this.tileDCs;
	
	this.initialize = function(){ 
		this.tileDCs = [];
		for( var x = 0; x < 18; x++ ){ 
			var faggot = new MahjongTileDC();
			this.tileDCs.push( faggot );
		}
	}
	
	// The user's hand is always drawn on the bottom
	this.draw = function( player ){ 
		// step 1: draw the exposed hand
		var y = 0;
		
		// step 2: draw hidden hand
		var hidden = player.hidden;
		var tiledata;
		for( var x = 0; x < hidden.length; x++ ){
			tiledata = { 
				'suit': hidden[x].suit,
				'value': hidden[x].value,
				'note': hidden[x].note
			}
			this.tileDCs[ y + x ].SetAs(tiledata);
			this.tileDCs[ y + x ].draw( 
				GAME_WIDTH / 4 + x * TILE_WIDTH,
				GAME_HEIGHT - 175,
				Z_TILES
			);
		}
	}
} 
