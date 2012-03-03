// I have 3 joker tiles
function CreateSet(){ 
	var tileset = [];
	for(var suit = 0; suit < 5; suit++){ 
		for(var value = 0; value < 9; value++){ 
			tileset.push( new $.gameQuery.Animation( { 
				'imageURL': IMAGE_PATH + "tiles/" + ( suit * 10 + value ) + ".png"
			} ) );
		}
	}
	return tileset;
}
