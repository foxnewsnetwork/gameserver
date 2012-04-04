var MahjongHand = function(){ 
	this.hidden = [];
	this.exposed = [];
	this.exposedOrder = [];
	
	//Draw a tile from the board and place with the hidden tiles
	this.drawtile = function( tiles ){ 
		tileToAdd = tiles.pop();
		$("#testarea").append(tileToAdd.tohtml());
	
		this.hidden.push( tileToAdd );
		this.sorthand();
		
		return tileToAdd;
	}
	
	//Expose a tile. Currently this is only done if you drew a flower.
	//Place that tile with your exposed tiles.
	this.exposeTile = function(tile){
		var length = this.hidden.length;
		var tileLoc = 0;
		for(var i = 0; i < length; i++)
		{
		if(this.hidden[i].tohtml() == tile.tohtml())
				{
					tileLoc = i;
				}
		}
		this.hidden.splice(tileLoc,1);
		this.exposed.push(tile);
		
		this.exposedOrder.push("Flower");

		
		
	}
	//Discard a tile. Essentially place it on the board for all to see.
	this.discardtile = function(tiles, tile){ 

		var faggot = this.hidden[tile];
		$('#testarea').append(faggot.tohtml());
		this.hidden.splice(tile, 1);
		tiles.push(faggot);
		this.sorthand();
		return faggot;
	}
	
	//Find a given tile among your hidden tiles
	//Return the location of this tile
	this.findTileLocation = function(tile){
		var length = this.hidden.length;
		var tileLoc = 0;
		for(var i = 0; i < length; i++)
		{
		if(this.hidden[i].tohtml() == tile.tohtml())
				{
					tileLoc = i;
				}
		}
		return tileLoc;
	}
	
	//Sort your hand. The hidden tiles are sorted.
	//Currently your exposed tiles are not sorted because
	//that messes with the graphical display.
	this.sorthand = function(){ 
		this.hidden.sort( function(a,b){ 
			return a.sval() - b.sval();
		} );
		//this.exposed.sort( function(a,b){
			//return a.sval() - b.sval();
		//} );
	}
	
	//A pon was called. Place the pon'd tile into exposed.
	//Also place the two other tiles in your hidden hand that match
	//the pon tile.
	this.ponTile = function(tileToAdd){

		this.exposed.push( tileToAdd );
		
		this.exposedOrder.push("Pon");
		
		for(var i = 0; i < 2;i++)
			{
			tileLoc = this.findTileLocation(tileToAdd);
			ponTile = this.hidden[tileLoc];
			this.hidden.splice(tileLoc, 1);
			this.exposed.push(ponTile);
			this.exposedOrder.push("Pon");
			}
		
		this.sorthand();
	}
	
	//A chi was called. Place the chi tile into exposed.
	//Deciding the best way to find the other sequential tiles is yet to be
	//implemented.
	this.chiTile = function(tileToAdd,tiles){
		chiTileFirst = this.hidden[tiles[0]];
		chiTileSecond = this.hidden[tiles[1]];
		tempTileArray = [tileToAdd,chiTileFirst,chiTileSecond];
		tempTileArray.sort(function(a,b){
			return a.sval() - b.sval();
		});
		
		if( TileFlush(tempTileArray[0], tempTileArray[1], tempTileArray[2] ) ){
		this.exposed.push( tempTileArray[0] );
		this.exposed.push(tempTileArray[1]);
		this.exposed.push(tempTileArray[2]);
		this.hidden.splice(tiles[0],1);
		this.hidden.splice(tiles[1], 1);
		
		
		this.sorthand();
		return true;
		}
		return false;
		
	}
	
	//A kan was called.
	//Get the four tiles that match, put them in exposed.
	this.kanTile = function(tileToAdd){
		this.exposed.push( tileToAdd );
		
		//this.exposedOrder.push("Pon");
		
		for(var i = 0; i < 3;i++)
			{
			tileLoc = this.findTileLocation(tileToAdd);
			kanTile = this.hidden[tileLoc];
			this.hidden.splice(tileLoc, 1);
			this.exposed.push(kanTile);
			//this.exposedOrder.push("Pon");
			}
		
		this.sorthand();
	}
	// chi is a 3 flush
	this.checkChi = function(tile){ 
		var counter = 0;
		for( var k = 0; k < this.hidden.length - 2; k++ ){ 
			if( TileFlush(tile, this.hidden[k], this.hidden[k+1] ) )
				return true;
			if( TileFlush(this.hidden[k], tile, this.hidden[k+1] ) )
				return true;
			if( TileFlush(this.hidden[k], this.hidden[k+1], tile ) )
				return true;
		}
		return false;
	}
	
	// pon is 3 in a roll
	this.checkPon = function(tile){ 
		var counter = 0;
		for( var x in this.hidden ){ 
			if( TileEqual( tile, this.hidden[x] ) )
				counter += 1;
			if( counter == 2 )
				return true;
		}
		return false;
	}
	
	// kan is 4 in a roll
	// calling it with no tiles checks for existence of 4-in-a-rolls
	// keep in mind the hand is sorted for a reason
	this.checkKan = function(tile){ 
		if( tile == undefined ){ 
			var lolcat = 0;
			for( var x = 0; x < this.hidden.length - 1; k++ ){ 
				if( TileEqual(this.hidden[x], this.hidden[x+1]) )
					lolcat += 1;
				else
					lolcat = 0;
				if( counter == 4 )
					return true;
			}
			return false;
		}
		
		var counter = 0;
		for( var x in this.hidden ){ 
			if( TileEqual( tile, this.hidden[x] ) )
				counter += 1;
			if( counter == 3 )
				return true;
		}
		return false;
	}
	//this check ron is for checking on the player draw
	this.checkRon = function(){ 
		var singleCount = 0, doubleCount = 0, tripleCount = 0, quadCount = 0, straightCount = 0;
		var x = 0, y = 0;
		while( x < this.hidden.length ){ 
			//$("#clickedtile").append("| "+ x + " ");
			//(this.hidden.length);

			y = 0;
			singleCount += 1;
			y += 1;
			if( TileEqual( this.hidden[x], this.hidden[x+1] ) ){ 
				singleCount += -1;
				doubleCount += 1;
				y += 1;
				if( TileEqual( this.hidden[x], this.hidden[x+1], this.hidden[x+2] ) ){ 
					doubleCount += -1;
					tripleCount += 1;
					y += 1;
					
					if( TileEqual(this.hidden[x], this.hidden[x+3] ) ){
						quadCount += 1;
					}
				}
				x += y;
				continue;
			}
			if( TileFlush(this.hidden[x], this.hidden[x+1], this.hidden[x+2]) ) { 
				straightCount += 1;
				singleCount += -1;
				y += 2;
				x += y;
				continue;
			}
			x += y;
			if( singleCount - quadCount > 0 )
				return false;
			if( doubleCount > 1 )
				return false;
		}
		if( doubleCount == 1 ){
			numOfNeededTriples = parseInt((this.hidden.length - 2) / 3);
			if( tripleCount + straightCount == numOfNeededTriples ){
				return true;
			}	
		}
		return false;
		// TODO: get this function to return the point value of the hand when true
	}
	//This check ron is for another player discarding a tile
	//due to javascript, could condense this with the previous function
	//to do whe refactoring
	this.checkRonFromDiscard = function(tile){ 
		var singleCount = 0, doubleCount = 0, tripleCount = 0, quadCount = 0, straightCount = 0;
		var x = 0, y = 0;
		var tempTileToRemove;
		this.hidden.push(tile);
		this.sorthand();
		
		while( x < this.hidden.length ){
			if(TileEqual(this.hidden[x],tile))
				tempTileToRemove = x;
			y = 0;
			singleCount += 1;
			y += 1;
			if( TileEqual( this.hidden[x], this.hidden[x+1] ) ){ 
				singleCount += -1;
				doubleCount += 1;
				y += 1;
				if( TileEqual( this.hidden[x], this.hidden[x+1], this.hidden[x+2] ) ){ 
					doubleCount += -1;
					tripleCount += 1;
					y += 1;
					if( TileEqual(this.hidden[x], this.hidden[x+3] ) ){
						tripleCount += -1;
						quadCount += 1;
					}
				}
				x += y;
				continue;
			}
			if( TileFlush(this.hidden[x], this.hidden[x+1], this.hidden[x+2]) ) { 
				straightCount += 1;
				singleCount += -1;
				y += 2;
				x += y;
				continue
			}
			x += y;
			if( singleCount - quadCount > 0 )
				{
				this.hidden.splice(tempTileToRemove, 1);
				return false;
				}
			if( doubleCount > 1 )
				{
				this.hidden.splice(tempTileToRemove, 1);
				return false;
				}
		}
		if( doubleCount == 1 ){
			//alert(quadCount + " " + this.hidden.length);
	
			numOfNeededTriples = parseInt((this.hidden.length - ((4 * quadCount) + 2)) / 3);
			alert(numOfNeededTriples + " " + tripleCount + " " + straightCount);
			if( tripleCount + straightCount == numOfNeededTriples ){
				
				this.hidden.splice(tempTileToRemove, 1);
				return true;
			}
			
		}
		this.hidden.splice(tempTileToRemove, 1);
		
		return false;
		// TODO: get this function to return the point value of the hand when true
	}
	
	//Convert the hand state into a json
	this.tojson = function(){ 
		var data = { 
			'hidden': [],
			'exposed': [],
			'layout': []
		};		
		for( var x in this.hidden )
			data['hidden'].push( this.hidden[x].tojson() );
		for( var x in this.exposed )
			data['exposed'].push( this.exposed[x].tojson() );
		for(var y in this.exposedOrder)
			{
			data['layout'].push(this.exposedOrder[y]);
			//$("#clickedtile").append("|a "+ this.exposedOrder[y] + " ");

			}
		return data;
	}
	
	//Convert a json into the hand state.
	this.fromjson = function(data){ 
		this.hidden = [];
		this.exposed = [];
		
		for( var x in data['hidden'] ){
			this.hidden.push(  new MahjongTiles() );
			this.hidden[x].fromjson( data['hidden'][x] );
		}
		for( var x in data['exposed'] ){
			this.exposed.push( new MahjongTiles() );
			this.exposed[x].fromjson( data['exposed'][x] );
		}
	}
	
	//Convert the hand into readable html.
	this.tohtml = function(){ 
		var result = "<h4>Hidden Hand: </h4>";
		for( var x in this.hidden ){ 
			result += this.hidden[x].tohtml();
		}
		result += "<h4>Exposed Hand: </h4>";
		for( var x in this.exposed ){ 
			result += this.exposed[x].tohtml();
		}
		return result;
	}
}

