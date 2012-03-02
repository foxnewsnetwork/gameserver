
var MahjongBambooSprite = function(){ 
	this.sprite = new Graphics.spr( IMAGE_PATH + "bamboo.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 );
	this.enable = function(){ 
		this.sprite.frame(0);
		this.sprite.speed(0);
	}
	this.disable = function(){ 
		this.sprite.frame(10);
		this.sprite.speed(0);
	}
	this.draw = function( x, y, z ){
		this.sprite.speed(0);
		mibbuSetSpritePosition(this.sprite, x,y,z);
	}
	this.SetAs = function(value){
		this.sprite.frame(value);
		this.sprite.speed(0);
	}
}

var MahjongCharacterSprite = function(){ 
	this.sprite = new Graphics.spr( IMAGE_PATH + "characters.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 );
	this.enable = function(){ 
		this.sprite.frame(0);
		this.sprite.speed(0);
	}
	this.disable = function(){ 
		this.sprite.frame(10);
		this.sprite.speed(0);
	}
	this.draw = function( x, y, z ){
		this.sprite.speed(0);
		mibbuSetSpritePosition(this.sprite, x,y,z);
	}
	this.SetAs = function(value){
		this.sprite.frame(value);
		this.sprite.speed(0);
	}
}

var MahjongCircleSprite = function(){ 
	this.sprite = new Graphics.spr( IMAGE_PATH + "circles.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 );
	this.enable = function(){ 
		this.sprite.frame(0);
		this.sprite.speed(0);
	}
	this.disable = function(){ 
		this.sprite.frame(10);
		this.sprite.speed(0);
	}
	this.draw = function( x, y, z ){
		this.sprite.speed(0);
		mibbuSetSpritePosition(this.sprite, x,y,z);
	}
	this.SetAs = function(value){
		this.sprite.frame(value);
		this.sprite.speed(0);
	}
}

var MahjongMiscSprite = function(){ 
	this.sprite = new Graphics.spr( IMAGE_PATH + "misc.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 );
	this.enable = function(){ 
		this.sprite.frame(0);
		this.sprite.speed(0);
	}
	this.disable = function(){ 
		this.sprite.frame(10);
		this.sprite.speed(0);
	}
	this.draw = function( x, y, z ){
		this.sprite.speed(0);
		mibbuSetSpritePosition(this.sprite, x,y,z);
	}
	this.SetAs = function(value){
		this.sprite.frame(value);
		this.sprite.speed(0);
	}
}

var MahjongFlowerSprite = function(){ 
	this.sprite = new Graphics.spr( IMAGE_PATH + "flowers.png", TILE_WIDTH, TILE_HEIGHT, 9, 0 );
	this.enable = function(){ 
		this.sprite.frame(0);
		this.sprite.speed(0);
	}
	this.disable = function(){ 
		this.sprite.frame(10);
		this.sprite.speed(0);
	}
	this.draw = function( x, y, z ){
		this.sprite.speed(0);
		mibbuSetSpritePosition(this.sprite, x,y,z);
	}
	this.SetAs = function( value, note ){ 
		if( value == undefined && note == undefined ){ 
			this.sprite.frame(8);
			this.sprite.speed(0);
			return;
		}
		if( value == VALUE_FLOWERS )	{
			this.sprite.frame( note );
		}
		else if( value == VALUE_SEASONS ){ 
			this.sprite.frame( note + 4 );
		}
		this.sprite.speed(0);
	}
}

var MahjongTileDC = function(){ 
	this.sprite;
	
	this.disable = function(){ 
		this.sprite.disable();
	}
	
	this.enable = function(){ 
		this.sprite.enable();
	}
	
	this.draw = function(x,y,z){ 
		this.sprite.draw(x,y,z);
	}	
		
	this.SetAs = function(tiledata){ 
		
		if( tiledata == undefined ){ 
			this.sprite = new MahjongFlowerSprite();
			this.sprite.SetAs();
			return;
		}

		switch( tiledata['suit'] ){ 
			case SUIT_CIRCLES:
				this.sprite = new MahjongCircleSprite();
				this.sprite.SetAs( tiledata['value'] );
				break;
			case SUIT_BAMBOO:
				this.sprite = new MahjongBambooSprite();
				this.sprite.SetAs( tiledata['value'] );
				break;
			case SUIT_CHARACTERS:
				this.sprite = new MahjongCharacterSprite();
				this.sprite.SetAs( tiledata['value'] );
				break;
			case SUIT_MISC:
				if( tiledata['value'] < VALUE_FLOWERS ){ 
					this.sprite = new MahjongMiscSprite();
					this.sprite.SetAs( tiledata['value'] );
				}
				else{ 
					this.sprite = new MahjongFlowerSprite();
					this.sprite.SetAs( tiledata['value'], tiledata['note'] );
				}
				break;
			default:
				alert( "severe fail occured; can't render" );
		}

	}
}

