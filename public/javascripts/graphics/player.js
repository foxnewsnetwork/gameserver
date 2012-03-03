
var MahjongGraphicsPlayer = function(){ 
	this.ptileset = CreateSet();
	this.pgroup;
	
	this.initialize = function(element){ 
		// create the group
		this.pgroup = $.playground().addGroup( element + "-player", { 
			'width': PLAYER_WIDTH,
			'height': PLAYER_HEIGHT,
			'posx': X_PLAYER,
			'posy': Y_PLAYER
		} );
		
		// lay down the placeholders for the hidden hand
		var posx, posy;
		for( var k = 0; k < 14; k++ ){ 
			posy = Y_PLAYER;
			posx = X_PLAYER + k * TILE_WIDTH
			this.pgroup.addSprite( "phidden-" + k, { 
				'width': TILE_WIDTH ,
				'height': TILE_HEIGHT ,
				'posx': posx ,
				'posy': posy
			} );
		}
		
		// todo: write the code to show the exposed hand
		return this;
	}
	
	this.draw = function( playerstate ){ 
		var hand = playerstate['hand'];
		
		// step 1: we disable useless stuff
		for( var k = 0; k < this.ptileset.length; k++){ 
			$("#phidden-" + k).setAnimation();
		}
		
		// step 2: actually attach the sprites
		for( var j = 0; k < hand['hidden'].length; k++){ 
			$("#phidden-" + k).setAnimation( this.pgroup[k] );
		}
	}
}

