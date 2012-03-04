// I have 3 joker tiles
function CreateSet(){ 
	var tileset = [];
	$("#debug").append( "<h1>tile generation: </h1>" );
	for(var suit = 0; suit < 5; suit++){ 
		for(var value = 0; value < 9; value++){ 
			tileset.push( new $.gameQuery.Animation( { 
				'imageURL': IMAGE_PATH + "tiles/" + ( suit * 10 + value ) + ".png"
			} ) );
			$("#debug").append( "<p><img alt='tile' src='" + IMAGE_PATH + "tiles/" + ( suit * 10 + value ) + ".png" + "' /></p>" );
		}
	}
	return tileset;
}

var MahjongSet;
var staticTileId;
var staticTileGroup;
function MahjongStaticInitialization(){
	MahjongSet = CreateSet();
	staticTileId = 0;
	staticTileGroup = $.playground().addGroup( "tiles", { width: GAME_WIDTH, height: GAME_HEIGHT } );
};
var MahjongTileSprite = function(){ 
	this.sprite;
	staticTileId += 1;
	this.tileId = staticTileId;
	this.x;
	this.y;
	this.suit;
	this.value;
	
	this.MoveTo = function( deltax, deltay ){ 
		this.SetAt( this.x + deltax, this.y + deltay );
	}	
	
	this.tohtml = function(){ 
		var output = "<p>" 
			+ " sprite detail: " + this.sprite 
			+ " tileId " + this.tileId 
			+ " suit&value:  " + this.suit + " " + this.value 
			+ " x&y: " + this.x + " " + this.y
			+ "</p>";
		return output;
	}
		
	this.SetAt = function(xpos, ypos){ 
		this.x = xpos;
		this.y = ypos;
		if( this.suit == undefined || this.value == undefined )
			return;
		else{
			if(this.sprite != undefined){
				this.sprite.css( "left" , xpos + "px" );
				this.sprite.css( "top" , ypos + "px" );
				this.sprite.css( "z-index", 99 );
			}
			else{
				staticTileGroup.addSprite( "tile" + this.tileId, { 
					animation: MahjongSet[ this.suit *9 + this.value ],
					width: TILE_WIDTH,
					height: TILE_HEIGHT,
					posx: this.x,
					posy: this.y,
					posz: 99
				} ); 
				this.sprite = $( "#tile" + this.tileId );
			}
		}
 
	}
	
	this.SetAs = function(suit, value){ 
		this.suit = suit;
		this.value = value;
		if( suit == undefined && value == undefined ){ 
			// blank tile
			this.suit = 4;
			this.value = 8;
		}
		if( this.x == undefined || this.y == undefined )
			return;
		else{
			if(this.sprite != undefined){
				this.sprite.setAnimation(MahjongSet[ this.suit *9 + this.value ]);
			}
			else{
				this.sprite = staticTileGroup.addSprite( "tile" + this.tileId, { 
					animation: MahjongSet[ this.suit *9 + this.value ],
					width: TILE_WIDTH,
					height: TILE_HEIGHT,
					posx: this.x,
					posy: this.y,
					posz: 99
				} ); 
				this.sprite = $( "#tile" + this.tileId );
			}
		} 
	}
	
	this.destroy = function(){ 
		staticTileId -= 1;
		this.x = undefined;
		this.y = undefined;
		if( this.sprite != undefined )
			this.sprite.remove();
		this.sprite = undefined;
		this.suit = undefined;
		this.value = undefined;
		this.tileId = undefined;
	}
}
