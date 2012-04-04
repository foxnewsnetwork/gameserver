var MahjongTiles = function(s,v){
	this.suit = s;
	this.value = v;

	//Return a comparable value for the tile.
	this.sval = function(){ 
		return this.suit * 10 + this.value
	}
	
	//Convert the tile into json
	this.tojson = function(){ 
		var data = { 
			'suit': this.suit,
			'value': this.value
		};
		return data;
	}
	
	//Json into a tile
	this.fromjson = function(data){ 
		this.suit = data['suit'];
		this.value = data['value'];
	}
	/*
	suit @ 0 => circles
	suit @ 1 => tiles
	suit @ 2 => characters
	suit @ 3 => misc
		0 => north
		1 => south
		2 => west
		3 => east
		4 => middle
		5 => fa
		6 => blank
		7 => dragon wild 1
		8 => dragon wild 2
	suit @ 4 => flowers & seasons
		0 => plum
		1 => orchid
		2 => chrysanthermum
		3 => bamboo
		4 => spring
		5 => summer
		6 => autumn
		7 => winter
		8 => flower wild 1
	*/
	this.tohtml = function(){ 
		var result = "";
		switch( this.suit ){ 
			case 0 :
				result += " | Circle " + ( 1 + this.value) + " | ";
				break;
			case 1 :
				result += " | Sticks " + ( 1 + this.value) + " | ";
				break;
			case 2 :
				result += " | Characters " + (1 + this.value) + " | ";
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
}

