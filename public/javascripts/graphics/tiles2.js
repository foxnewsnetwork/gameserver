var MahjongTileDC = function(){ 
	// internal variables
	this.activeSprite;
	this.sprites = { 
		SUIT_CIRLES: new Graphics.spr( IMAGE_PATH + "circles.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 ), 
		SUIT_BAMBOO: new Graphics.spr( IMAGE_PATH + "bamboo.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 ),
		SUIT_CHARACTERS: new Graphics.spr( IMAGE_PATH + "characters.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 ),
		SUIT_MISC: { 
			VALUE_DRAGONS: new Graphics.spr( IMAGE_PATH + "flowers.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 ),
			VALUE_FLOWERS: new Graphics.spr( IMAGE_PATH + "flowers.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 )  
		}
	};

	// Public Interface Functions
	this.disable = function(){ 
		for( var x = SUIT_CIRCLES; x < SUIT_MISC; x++ ){ 
			alert( JSON.stringify( this.sprites ) );
			this.sprites[x].frame(10);
			this.sprites[x].speed(0);
		}
		var misc = this.sprites[SUIT_MISC];
		misc[VALUE_DRAGONS].frame(10);
		misc[VALUE_DRAGONS].speed(0);
		misc[VALUE_FLOWERS].frame(10);
		misc[VALUE_FLOWERS].speed(0);
	}
	this.enable = function(){ 
		if(this.activeSprite == undefined ){ 
			alert( "You're trying to activate a tile that hasn't been set" );
			return;
		}
	}
	this.SetAs = function(tiledata){ 
		this.disable();
		if( tiledata == undefined ){ 
			this.activeSprite = this.sprites[SUIT_MISC][VALUE_DRAGONS];
			this.activeSprite.frame(8);
		}
			
		var suit = tiledata['suit'];
		var value = tiledata['value'];
		var note = tiledata['note'];
		
		if( suit < SUIT_MISC ){
			this.activeSprite = this.sprites[suit];
			this.activeSprite.frame( value );
		}
		else{ 
			if( value < VALUE_FLOWERS ){
				this.activeSprite = this.sprites[suit][VALUE_DRAGONS];
				this.activeSprite.frame( value );
			}
			else
				this.activeSprite = this.sprites[suit][VALUE_FLOWERS];
				this.activeSprite.frame( note );
		}
	}
	this.draw = function(x,y,z){ 
		mibbuSetSpritePosition( this.activeSprite, x, y, z );
	}
	
	
	
	
}
