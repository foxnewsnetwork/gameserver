var game = new MahjongGame();
var actions;


function manageUI( stuff ){ 
	$("#draw").hide();
	$("#discard").hide();
	$("#end").hide();
	if( stuff['draw'] )
		$("#draw").show();
	if( stuff['discard'] )
		$("#discard").show();
	if( stuff['endturn'] )
		$("#end").show();
}

$(document).ready( function(){ 
	$("#new-game").click(function(){
		counter = 0;
		game.initialize();
		game.newgame();
		actions = game.GetPossibleActions();
		manageUI( actions );
		$("#mahjong-display").html( game.tohtml() );
		$("#debug").html( "activePlayer: " + game.activePlayer );
		$("#debug").append( "<p>Possible Moves: " + JSON.stringify(actions) + "</p>");
	});
	
	$("#endturn").click(function(){
		game.SetInteractivePlayer( game.activePlayer );
		game.EndTurn();
		actions = game.GetPossibleActions();
		manageUI( actions );
		$("#mahjong-display").html( game.tohtml() );	
		$("#debug").html( "activePlayer: " + game.activePlayer );
		$("#debug").append( "<p>Possible Moves: " + JSON.stringify(actions) + "</p>");
	});
	
	$("#drawtile").click(function(){
		game.SetInteractivePlayer( game.activePlayer );
		game.DrawTile();
		actions = game.GetPossibleActions();
		manageUI( actions );
		$("#mahjong-display").html( game.tohtml() );	
		$("#debug").html( "activePlayer: " + game.activePlayer );
		$("#debug").append( "<p>Possible Moves: " + JSON.stringify(actions) + "</p>");
	});
	
	$("#discardfirst").click(function(){
		counter += 1;
		game.SetInteractivePlayer( game.activePlayer );
		game.DiscardTile( 0 );
		actions = game.GetPossibleActions();
		manageUI( actions );
		$("#mahjong-display").html( game.tohtml() );	
		$("#debug").html( "activePlayer: " + game.activePlayer );
		$("#debug").append( "<p>Possible Moves: " + JSON.stringify(actions) + "</p>");
	});
	
	$("#discardtile").submit(function(){
		game.SetInteractivePlayer( game.activePlayer );
		game.DiscardTile( $("#discard-value").val() );
		actions = game.GetPossibleActions();
		manageUI( actions );
		$("#mahjong-display").html( game.tohtml() );	
		$("#debug").html( "activePlayer: " + game.activePlayer );
		$("#debug").append( "<p>Possible Moves: " + JSON.stringify(actions) + "</p>");
		return false;
	});
} );
