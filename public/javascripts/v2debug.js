var game = new MahjongGame();


$(document).ready( function(){ 
	$("#new-game").click(function(){
		game.initialize();
		game.newgame();
		$("#mahjong-display").html( game.tohtml() );
	});
	
	$("#drawtile").click(function(){
		var player = game.getactiveplayer();
		var board = game.board;
		player.drawtile(board);
		$("#mahjong-display").html( game.tohtml() );	
	});
	
	$("#discardtile").submit(function(){
		var player = game.getactiveplayer();
		var board = game.board;
		
		player.discardtile(board, Number( $("#discard").val() ) );
		$("#mahjong-display").html( game.tohtml() );	
		return false;
	});
} );
