var playerNumber = 3;	

var dicks = new MahjongGame();
dicks.initialize();
dicks.newgame();

// The game object
var Graphics = new mibbu(GAME_WIDTH, GAME_HEIGHT);
Graphics.fps();
Graphics.init();

var GameDC = new MahjongGameDC();

$(document).ready(function(){
	
	
	GameDC.initialize();
	Graphics.hook( function(){GameDC.draw(dicks)} );	
	//var data = Game.tojson();
	//$("#mahjong-display").html( JSON.stringify( data) );
});


Graphics.on();



