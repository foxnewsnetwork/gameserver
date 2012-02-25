var game = new MahjongGame();
var player;
var board;

$(document).ready( function(){ 
	$("#new-game").click(function(){
		game.initialize();
		game.newgame();
		$("#mahjong-display").html( game.tohtml() );
		$("#debug").html( "activePlayer: " + game.activePlayer );
		$("#debug").append( "<p>Possible Moves: " + JSON.stringify(game.GetPossibleActions(3)) + "</p>");
	});
	
	$("#drawtile").click(function(){
		player.drawtile(board);
		$("#mahjong-display").html( game.tohtml() );	
		$("#debug").html( "activePlayer: " + game.activePlayer );
		$("#debug").append( "<p>Possible Moves: " + JSON.stringify(game.GetPossibleActions(3)) + "</p>");
	});
	
	$("#discardtile").submit(function(){
		player.discardtile(board, Number( $("#discard").val() ) );
		$("#mahjong-display").html( game.tohtml() );	
		$("#debug").html( "activePlayer: " + game.activePlayer );
		$("#debug").append( "<p>Possible Moves: " + JSON.stringify(game.GetPossibleActions(3)) + "</p>");
		return false;
	});
} );
