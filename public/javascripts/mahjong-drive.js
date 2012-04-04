/**************************
* Declarations                          *
***************************/
var game = new MahjongGame();
var playerVec = [];
var playerNumber;
var actions = [];
var startFlag = false;
var readyFlag = false;
var playerCanDiscard = false;
/**************************
* Mahjong Events Down          *
***************************/
//Events in the game, are self explanatory
//Most actions will find the originator of that action
//They will perform that action
//Then everyones available actoins will be updated

/////////////////////
AddGameFunction( "drawtile", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	
	game.DrawTile( pn );

	actions = game.GetPossibleActions(playerNumber);
	ManageUI(actions);
	
	$("#display").html( game.tohtml() );
} );

AddGameFunction( "discardtile", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	game.DiscardTile( pn, eventdata ); 
	actions = game.GetPossibleActions(playerNumber);
	ManageUI(actions);
	if(pn == playerNumber)
	{graphics.player.resetPick();}
	
	game.EndTurn( pn );
	actions = game.GetPossibleActions(playerNumber);
	ManageUI(actions);
	$("#display").html( game.tohtml() );
} );

AddGameFunction( "endturn", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	//game.EndTurn( pn );
	//actions = game.GetPossibleActions(playerNumber);
	//ManageUI(actions);
} );

AddGameFunction( "pon", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	game.Pon( pn );
	actions = game.GetPossibleActions(playerNumber);
	ManageUI(actions);

	$("#display").html( game.tohtml() );

} );
AddGameFunction( "chi", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	game.Chi( pn );
	actions = game.GetPossibleActions(playerNumber);
	ManageUI(actions);

	$("#display").html( game.tohtml() );

} );

AddGameFunction("commitchi",function( origin,eventdata){
	var pn = GetPlayerNumber( origin );
	game.commitChi( pn,eventdata );
	actions = game.GetPossibleActions(playerNumber);
	ManageUI(actions);
	if(pn == playerNumber)
	{graphics.player.resetChiPick();}
	$("#display").html( game.tohtml() );
});
AddGameFunction( "kan", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	game.Kan( pn );
	actions = game.GetPossibleActions(playerNumber);
	ManageUI(actions);

	$("#display").html( game.tohtml() );

} );

AddGameFunction( "ron", function( origin, eventdata ){ 
	var pn = GetPlayerNumber( origin );
	game.Ron( pn );
	actions = game.GetPossibleActions(playerNumber);
	ManageUI(actions);
	alert("GAME IS OVER. Player "+ pn + " has won the game");
	$("#display").html( game.tohtml() );

} );
AddGameFunction( "initial sync", function( origin, eventdata ){ 
	
	//Everyone syncs. It gets rid of the weird one person off error.
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
		//game.playerJoined();
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
//THIS SECTION IS CURRENTLY UNUSED.
//WAS ORIGINALLY FOR HTML GAME UI
//NOW HAVE MOVED ON
$(document).ready( function(){ 
	ManageUI();
	$("#joingame").click( function(){ 
		JoinRoom();
		
	} );
	
	$("#quitgame").click( function(){ 
		LeaveRoom();
	} );
	
	$("#drawtile").click( function(){ 
		FireEvent("drawtile","-");

	} );
	
	$("#discardtile").submit( function(){ 
		FireEvent("discardtile",$("#tile").val());
	
		return false;
	} );
	
	$("#endturn").click( function(){ 

		FireEvent("endturn","-");

	} );
} );

/**************************
* Helper Functions                   *
***************************/

//Everytime an action is called
//update the available actions and hide buttons.
function ManageUI ( actions ){ 
	if( actions == undefined || readyFlag == false){ 
		$("#drawtile").hide();
		$("#discardtile").hide();
		$("#quitgame").hide();
		$("#endturn").hide();
		return;
	}
	if( actions['draw'] )
		{$("#drawtile").show();
		graphics.board.actionsDraw();}
	if( actions['discard'] )
		{
			playerCanDiscard = true;
			$("#drawtile").hide();
			$("#discardtile").show();
			graphics.board.actionsDiscard();
		}
	if( actions['endturn'] ){
		$("#drawtile").hide();
		$("#discardtile").hide();
		$("#endturn").show();
		graphics.board.actionsEndTurn();
		}
	if(actions['pon']){
		graphics.board.actionsPon();
	}
	if(!(actions['pon'])){
		graphics.board.actionsDeactivatePon();
	}
	if(actions['chi']){
		graphics.board.actionsChi();
	}
	if(!actions['chi']){
	 	graphics.board.actionsDeactivateChi();
	}
	if(actions['chicall']){
		graphics.board.actionsCommit();
	}
	if(!actions['chicall']){
		graphics.board.actionsDeactivateCommit();
	}
	if(actions['openkan']){
		graphics.board.actionsKan();
	}
	if(!actions['openkan']){
		graphics.board.actionsDeactivateKan();
	}
	if(actions['ron']){
		graphics.board.actionsRon();
	}
	if(!actions['ron']){
		graphics.board.actionsDeactivateRon();
	}
	if( !(actions['endturn']) && !(actions['discard']) && !(actions['draw']))
		{
		$("#drawtile").hide();
		$("#discardtile").hide();
		$("#endturn").hide();
		graphics.board.actionsInactive();

		}
	
}

//This section is self explanatory.
//The action fires a request to perform an action
////////////////////////////////////////////
function drawTile(){
	FireEvent("drawtile","-");
	
}
function discardTile(){

	FireEvent("discardtile",graphics.player.returnTile());

}
function endTurn(){
	FireEvent("endturn","-");
}
function pon(){
	FireEvent("pon","-");
}
function chi(){
	FireEvent("chi","-");
}
function commitChi(){
	FireEvent("commitchi", graphics.player.returnChiPick());
}
function kan(){
	FireEvent("kan","-");
}
function ron(){
	FireEvent("ron","-");
}

//A tile is picked. Set that as a picked tile graphically
function setPlayerPickTile(handId){
	
	if(game.playerChoosingChi())
	{	
	graphics.setChiPick(handId);	
	}
	 else{
	graphics.setPlayerPick(handId);
	}
}
//Get the playerId using serial id
function GetPlayerNumber( sId ){ 
	for( var x in playerVec ){ 
		if( playerVec[x] == sId )
			return x;
	}
	return false;
}
