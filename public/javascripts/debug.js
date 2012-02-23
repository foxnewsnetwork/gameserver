// Test code for stuff

var MahJongTiles = function(s,v,n){
	this.suit = s;
	this.value = v;
	this.note = n;
	this.sval = function(){ 
		return this.note + this.value * 4 + this.suit * 9;
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
				result += "<p>Circle " + this.value + "</p>";
				break;
			case 1 :
				result += "<p>Sticks " + this.value + "</p>";
				break;
			case 2 :
				result += "<p>Characters " + this.value + "</p>";
				break;
			default :
				switch( this.value ){ 
					case 0:
						result += "<p>North</p>";
						break;
					case 1:
						result += "<p>South</p>";
						break;
					case 2:
						result += "<p>West</p>";
						break;
					case 3: 
						result += "<p>East</p>";
						break;
					case 4: 
						result += "<p>Zhong</p>";
						break;
					case 5: 
						result += "<p>Fa</p>";
						break;
					case 6: 
						result += "<p>Blank</p>";
						break;
					case 7:
						switch( this.note ){ 
							case 0:
								result += "<p>Plum</p>";
								break;
							case 1:
								result += "<p>Orchid</p>";
								break;
							case 2:
								result += "<p>Chrysanthermum</p>";
								break;
							case 3:
								result += "<p>Bamboo</p>";
								break;
						}
						break;
					case 8:
						switch( this.note ){ 
							case 0:
								result += "<p>Spring</p>";
								break;
							case 1:
								result += "<p>Summer</p>";
								break;
							case 2:
								result += "<p>Autumn</p>";
								break;
							case 3:
								result += "<p>Winter</p>";
								break;
						}
						break;
				}
				break;
		}
		return result;
	}
}

var MahjongBoard = function(){ 
	this.discardTiles;
	this.freshTiles;
	
	this.newboard = function(){ 
		this.freshTiles = [];
		this.discardTiles = [];
		for( var j = 0; j < 4; j++) {
			for( var k = 0; k < 9; k++ ) {
				this.freshTiles.push( new MahJongTiles(j, k, 0) );
				this.freshTiles.push( new MahJongTiles(j, k, 1) );
				this.freshTiles.push( new MahJongTiles(j, k, 2) );
				this.freshTiles.push( new MahJongTiles(j, k, 3) );
			}
		}
		
	}
	
	// shuffles the frestiles
	this.shuffle = function(){ 
		var tempTile;
		var k;
		for( var j = 0; j < 144; j++){
			k = Math.floor( Math.random() * 144 );
			var tempTile = this.freshTiles[k];
			this.freshTiles[k] = this.freshTiles[j];
			this.freshTiles[j] = tempTile; 
		}
	}
	
	this.tohtml = function(){ 
		var shtml = "";
		for( var x in this.freshTiles ){ 
			shtml += this.freshTiles[x].tohtml();
		}
		return shtml;
	}
}

var board = new MahjongBoard();
var socket = io.connect('http://localhost');
socket.on('news', function (data) {
	$("#buttfuck").html('<p>Socket io working. yay!</p>');
	$("#buttfuck").append( data );
	socket.emit('my other event', { my: 'data' });
});

AddShopFunction( "open shop down", function(items){ 
	$("#buttfuck").html( "<img alt='nigger' src='" + items["picture_path"] + "' />" );
});

AddChatFunction( "chat down", function(data){ 
	$("#chat").append( "<p>" + "from: " + data["sessionId"] + " ==> " + data['message'] + "</p>" );
});

AddChatFunction( "join channel down", function(data){ 
	$("#chat").append( "<p>" + "from: server ==> you've joined " + data + "</p>" );
});

$(document).ready(function(){
	$("#mahjong-generate").click( function(){
		board.newboard();
		$("#mahjong-display").html( board.tohtml() );
	} );
	
	$("#mahjong-shuffle").click( function(){ 
		board.shuffle();
		$("#mahjong-display").html( board.tohtml() );
	})
	
	$("#shop").click(function(){
		$("#buttfuck").html( "request submitted" );
		GetShopItems();
	});
	
	$("#send-message").submit( function( ){ 
		PlayerChat( $("#message").val() );
		return false;
	});
	
	$("#join-channel").submit(function(){ 
		JoinChannel( $("#channel").val() );
		return false;
	});
} );


