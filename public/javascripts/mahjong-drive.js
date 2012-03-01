/**************************
* Declarations                          *
***************************/
var game = new MahjongGame();
var playerVec = [];
var playerNumber;
var actions = [];
var startFlag = false;
var readyFlag = false;

/**************************
* Mahjong Events Down          *
***************************/

AddGameFunction( "drawtile", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	game.DrawTile( pn );
} );

AddGameFunction( "discardtile", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	game.DiscardTile( pn, eventdata ); 
} );

AddGameFunction( "endturn", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	game.EndTurn( pn );
} );

AddGameFunction( "initial sync", function( origin, eventdata ){ 
	if( origin != sessionId )
		game.fromjson( eventdata );
	$("#debug").html( "Game ready and synced!" );
	$("#debug").append( "<p>PlayerNumber: " + playerNumber + "</p>");
	readyFlag = true;
	$("#display").html( game.tohtml() );
	actions = game.GetPossibleActions( playerNumber );
	ManageUI( actions );
	$("#debug").append( JSON.stringify( actions ) );
} );

/**************************
* Game Server Events Down *
***************************/

AddGameFunction( "join room down", function(data){ 
	if( data['sessionId'] == sessionId ){
		$("#chat").append( "<p>you have joined " + data['roomId'] + "</p>" );
		$("#joingame").hide();
		$("#quitgame").show();
	}
	else
		$("#chat").append( "<p>" + data['sessionId'] + " has joined " + data['roomId'] + "</p>" );		
		
} );

AddGameFunction( "left room down", function(data){ 
	if( data['sessionId'] == sessionId ){
		$("#chat").append( "<p>you have left " + data['roomId'] + "</p>" );
		$("#joingame").show();
		$("#quitgame").hide();
	}
	else
		$("#chat").append( "<p>" + data['sessionId'] + " has left " + data['roomId'] + "</p>" );
	
	// TODO: handle the case when we're midgame and some faggot leaves
} );

AddGameFunction( "room stat down", function(data){ 
	playerVec = data['people'];
	$("#roomstatus").html( "<h5>" + data['population'] + " people in room#" + data['roomId'] + "</h5>" );
	for( var k in playerVec )
		$("#roomstatus").append( "<p>" + playerVec[k] + "</p>" );
	if( startFlag == false && playerVec.length == 4 )
		StartGame();
} );

AddGameFunction( "start game down", function(data){ 
	startFlag = true;
	game.initialize();
	game.newgame();
	for( var k in playerVec )
		if( playerVec[k] == sessionId )
			playerNumber = k;
	var gamestate = game.tojson();
	FireEvent( "initial sync", gamestate );
} );

AddGameFunction( "end game down", function(data){ 
	// TODO: write this function
} );

/**************************
* JQuery Game UI                  *
***************************/
$(document).ready( function(){ 
	ManageUI();
	
	$("#joingame").click( function(){ 
		JoinRoom();
	} );
	
	$("#quitgame").click( function(){ 
		LeaveRoom();
	} );
	
	$("#drawtile").click( function(){ 
		game.DrawTile( playerNumber );
		actions = game.GetPossibleActions(playerNumber);
		ManageUI(actions);
		$("#display").html( game.tohtml() );
	} );
	
	$("#discardtile").submit( function(){ 
		game.DiscardTile( playerNumber, $("#tile").val() );
		actions = game.GetPossibleActions(playerNumber);
		ManageUI(actions);
		$("#display").html( game.tohtml() );
		return false;
	} );
	
	$("#endturn").click( function(){ 
		game.EndTurn( playerNumber );
		actions = game.GetPossibleActions(playerNumber);
		ManageUI(actions);
		$("#display").html( game.tohtml() );
	} );
} );

/**************************
* Helper Functions                   *
***************************/
function ManageUI ( actions ){ 
	if( actions == undefined || readyFlag == false){ 
		$("#drawtile").hide();
		$("#discardtile").hide();
		$("#quitgame").hide();
		$("#endturn").hide();
		return;
	}
	if( actions['draw'] )
		$("#drawtile").show();
	if( actions['discard'] )
		$("#discardtile").show();
	if( actions['endturn'] )
		$("#endturn").show();
	
}

function GetPlayerNumber( sId ){ 
	for( var x in playerVec ){ 
		if( playerVec[x] == sId )
			return x;
	}
	return false;
}