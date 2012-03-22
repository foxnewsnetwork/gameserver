// I have 3 joker tiles
function CreateSet(){ 
	var tileset = [];
	$("#debug").append( "<h1>tile generation: </h1>" );
	for(var suit = 0; suit < 5; suit++){ 
		for(var value = 0; value < 9; value++){ 
			tileset.push( new $.gameQuery.Animation( { 
				'imageURL': IMAGE_PATH + "tiles/" + ( suit * 10 + value ) + ".png"
			} ) );
		}
	}
	//$("#debug").append( "<p><img alt='tile' src='" + IMAGE_PATH + "tiles/" + ( suit * 10 + value ) + ".png" + "' /></p>" );
   $("#debug").append("took out list of tiles for now");
	return tileset;
}

var MahjongSet;
var staticTileId;
var staticTileGroup;

function MahjongStaticInitialization(){

	MahjongSet = CreateSet();
	staticTileId = 0;
	staticTileGroup = $.playground().addGroup( "tiles", { width: GAME_WIDTH, height: GAME_HEIGHT } ).end();
};
var MahjongTileSprite = function(){ 
	this.sprite;
	staticTileId += 1;

//	if(staticTileId >= 129)
//		{
//		staticTileId += 1;
//		}
	this.tileId = staticTileId;
	this.x;
	this.y;
	this.suit;
	this.value;
	this.handId;
	this.SetCallback = function( name, callback ){ 
		if( this.sprite == undefined ){ 
			alert( "You've tried to set a callback for a completely uninitiated tile, you dumbass" );
			return;
		}
		/*
		var methods = [];
		for (var m in this.sprite) {
			if (typeof this.sprite[m] == "function") {
				methods.push(m);
			}
		}
		alert(methods.join(","));
		*/
		var eventinfo = { 
			'xpos': this.x,
			'ypos': this.y,
			'suit': this.suit,
			'value': this.value,
			'tileId': this.tileId,
			'handId': this.handId
		};
		switch( name ){ 
			case 'click':
				this.sprite.click( function(){ 
					callback(eventinfo);
				} );
				break;
			case 'mouseover':
				this.sprite.mouseover( function(){ 
					callback(eventinfo);
				} );
				break;
			case 'mouseout':
				this.sprite.mouseout( function(){
					callback(eventinfo);
				} );
				break;
		}
	}
	
	this.MoveTo = function( deltax, deltay ){ 
		this.SetAt( this.x + deltax, this.y + deltay );
	}	
	
	this.tohtml = function(){ 
				var result = "";
		switch( this.suit ){ 
			case 0 :
				result += " | Circle " + this.value + " | ";
				break;
			case 1 :
				result += " | Sticks " + this.value + " | ";
				break;
			case 2 :
				result += " | Characters " + this.value + " | ";
				break;
			case 3:
				switch( this.value ){ 
					case 0:
						result += " | North | ";
						break;
					case 1:
						result += " | South | ";
						break;
					case 2:
						result += " | West | ";
						break;
					case 3: 
						result += " | East | ";
						break;
					case 4: 
						result += " | Zhong | ";
						break;
					case 5: 
						result += " | Fa | ";
						break;
					case 6: 
						result += " | Blank | ";
						break;
					case 7:
						result += " | dragon wild 1 | ";
					case 8:
						result += " | dragon wild 2 | ";
						break;
				}
				break;
			case 4:		
				switch( this.value ){ 
						case 0:
							result += " | Plum | ";
							break;
						case 1:
							result += " | Orchid | ";
							break;
						case 2:
							result += " | Chrysanthermum | ";
							break;
						case 3:
							result += " | Bamboo | ";
							break;
						case 4:
							result += " | Spring | ";
							break;
						case 5:
							result += " | Summer | ";
							break;
						case 6:
							result += " | Autumn | ";
							break;
						case 7:
							result += " | Winter | ";
							break;
						case 8:
							result += " | flower wild | ";
				}
				break;
		}
		return result;

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
	
	this.SetAs = function(suit, value,handId){ 
		var changed = false;
		if(this.handId != handId || this.handId == undefined)
		{
			this.handId = handId;
			
		}
		if(this.suit != suit || this.suit == undefined)
		{
			this.suit = suit;
			changed = true;
		}
		if(this.value != value || this.value == undefined)
			{
			this.value = value;
			changed = true;
			}
		if( suit == undefined && value == undefined ){ 
			// blank tile
			this.suit = 4;
			this.value = 8;
		}
		if( this.x == undefined || this.y == undefined )
			return;
		else{
			if(this.sprite != undefined && changed){
				this.sprite.setAnimation(MahjongSet[ this.suit *9 + this.value ]);
		        
			}
			else if (this.sprite == undefined){
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
		//staticTileId -= 1;
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


var tiletohtml = function(suit, value){ 
			var result = "";
	switch( suit ){ 
		case 0 :
			result += " | Circle " + (1 + value ) + " | ";
			break;
		case 1 :
			result += " | Sticks " + (1 + value ) + " | ";
			break;
		case 2 :
			result += " | Characters " + (1 + value ) + " | ";
			break;
		case 3:
			switch( value ){ 
				case 0:
					result += " | North | ";
					break;
				case 1:
					result += " | South | ";
					break;
				case 2:
					result += " | West | ";
					break;
				case 3: 
					result += " | East | ";
					break;
				case 4: 
					result += " | Zhong | ";
					break;
				case 5: 
					result += " | Fa | ";
					break;
				case 6: 
					result += " | Blank | ";
					break;
				case 7:
					result += " | dragon wild 1 | ";
				case 8:
					result += " | dragon wild 2 | ";
					break;
			}
			break;
		case 4:		
			switch( value ){ 
					case 0:
						result += " | Plum | ";
						break;
					case 1:
						result += " | Orchid | ";
						break;
					case 2:
						result += " | Chrysanthermum | ";
						break;
					case 3:
						result += " | Bamboo | ";
						break;
					case 4:
						result += " | Spring | ";
						break;
					case 5:
						result += " | Summer | ";
						break;
					case 6:
						result += " | Autumn | ";
						break;
					case 7:
						result += " | Winter | ";
						break;
					case 8:
						result += " | flower wild | ";
			}
			break;
	}
	return result;

}

