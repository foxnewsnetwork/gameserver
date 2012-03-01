var MahjongTiles = function(s,v,n){
	this.suit = s;
	this.value = v;
	this.note = n;
	this.sval = function(){ 
		return this.note + this.value * 10 + this.suit * 100;
	}
	
	this.tojson = function(){ 
		var data = { 
			'suit': this.suit,
			'value': this.value,
			'note': this.note
		};
		return data;
	}
	
	this.fromjson = function(data){ 
		this.suit = data['suit'];
		this.value = data['value'];
		this.note = data['note'];
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
		7 => flower
			0 => plum
			1 => orchid
			2 => chrysanthermum
			3 => bamboo
		8 => season
			0 => spring
			1 => summer
			2 => autumn
			3 => winter
	*/
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
			default :
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
						switch( this.note ){ 
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
						}
						break;
					case 8:
						switch( this.note ){ 
							case 0:
								result += " | Spring | ";
								break;
							case 1:
								result += " | Summer | ";
								break;
							case 2:
								result += " | Autumn | ";
								break;
							case 3:
								result += " | Winter | ";
								break;
						}
						break;
				}
				break;
		}
		return result;
	}
}

