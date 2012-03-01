game = new MahjongGame();
$(document).ready(function(){
	game.initialize();
	game.newgame();
	var data = game.tojson();
	$("#mahjong-display").html( JSON.stringify( data) );
});
