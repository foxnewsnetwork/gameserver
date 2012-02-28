var game = new MahjongGame();
var actions;
var playerVec = [];
var playerHash = {};
var startFlag = false;

var socket = io.connect('http://localhost');

AddShopFunction( "open shop down", function(items){ 
	$("#debug-info").html( "<img alt='nigger' src='" + items["picture_path"] + "' />" );
});

AddChatFunction( "chat down", function(data){ 
	$("#chat").append( "<p>" + "from: " + data["sessionId"] + " ==> " + data['message'] + "</p>" );
});

AddChatFunction( "join channel down", function(data){ 
	if( data['sessionId'] == sessionId ) 
		$("#chat").append( "<p>" + "from: server ==> you've joined " + data['channelId'] + "</p>" );
	else
		$("#chat").append( "<p>" + "from: server ==> " + data['sessionId'] + " has joined " + data['channelId'] + "</p>" );
});

AddChatFunction( "left channel down", function(data){ 
	$("#chat").append( "<p>" + data['sessionId'] + " has left the channel</p>" );
} );

AddChatFunction( "channel stat down", function(data){ 
	$("#channel-stats").html( "<p>Currently, " + data['population'] + ' people in channel ' + data['channelId'] );
} );


AddGameFunction( "join room down", function(data){ 
	if( data['sessionId'] == sessionId ) {
		$("#chat").append( "<p>" + "from: server ==> you've joined room# " + data['roomId'] + "</p>" );
	}
	else {
		$("#chat").append( "<p>" + "from: server ==> " + data['sessionId'] + " has joined room# " + data['roomId'] + "</p>" );
	}
	
} );

AddGameFunction( "left room down", function(data){ 
	$("#chat").append( "<p>" + data['sessionId'] + " has left the room</p>" );
	var toKill;
	for( var k in playerVec ){ 
		if( playerVec[k] == data['sessionId'] ){
			toKill = k;
			playerVec.splice( toKill, 1 );
			break;
		}
	}
} );

AddGameFunction( "room stat down", function( data ){ 
	var playerCount = data['population'];
	playerVec = data['people'];
	startFlag = data['started'];
	$("#room-stats").html( "<p>Player Count: " + playerCount + "in " + data['roomId'] + "</p>" );
	for( var z in playerVec ){ 
		$("#room-stats").append( "<p>" + playerVec[z] + "</p>" );
	}
	if( playerVec.length == 4 && startFlag != true){
		StartGame( data['roomId'] );
	}
} );

AddGameFunction( "start game down", function(data){ 
	$("#debug-info").html( JSON.stringify( data ) + " and " + JSON.stringify( playerVec ) ); 
	$("#chat").append("<h4>Game Started!</h4>");
	game.initialize();
	game.newgame();
	for( var k in playerVec ){
		if(playerVec[k] == sessionId){
			game.SetInteractivePlayer( k );
			$("#debug-info").append( "playerNumber: " + k );
		}
	}
	actions = game.GetPossibleActions();
	manageUI(actions);
	$("#mahjong-display").html( game.tohtml() );	
	startFlag = true;
} );

AddGameFunction( "game event down", function(data){ 
	var eventname = data['name'];
	var eventdata= data['event'];	
	var eventsender = data['sessionId'];
	var playerNumber;
	for( var k in playerVec ){ 
		if(playerVec[k] == data['sessionId']){ 
			playerNumber = k;
			break;
		}
	}
	alert( JSON.stringify( data ) );
	game.SetInteractivePlayer( playerNumber );
	switch( eventname ){ 
		case 'draw':
			game.DrawTile();			
			break;
		case 'discard':
			game.DiscardTile( eventdata );
			break;
		case 'end':
			game.EndTurn();
			break;
		case 'ron':
			// TODO: write me!
			break;
		default:
			// TODO: throw error
			break;
	}
	actions = game.GetPossibleActions();
	
	manageUI(actions);
	$("#mahjong-display").html( game.tohtml() );	
} );

function manageUI( stuff ){ 
	$("#mahjong-draw").hide();
	$("#mahjong-discard").hide();
	$("#mahjong-end").hide();
	if( stuff == undefined )
		return;
	if( stuff['draw'] )
		$("#mahjong-draw").show();
	if( stuff['discard'] )
		$("#mahjong-discard").show();
	if( stuff['endturn'] )
		$("#mahjong-end").show();
}


$(document).ready(function(){
	// Managing the UI
	manageUI();
	
	// Channel Chat section
	$("#chat-message").submit(function(){
		PlayerChat( $("#message").val() );
		return false;
	});
	$("#channel-join").submit(function(){
		JoinChannel( $("#channel").val() );
		return false;
	});
	
	// Game-join section
	$("#mahjong-game").click(function(){
		JoinRoom( );	
	});
	
	// Mahjong Section
	$("#mahjong-draw").click(function(){
		FireEvent('draw', 'draw'); 
	});
	
	$("#mahjong-discard").submit( function(){
		FireEvent("discard", { tile: $("#discard-tile").val() } );
		return false;
	} );
	
	$("#mahjong-end").click(function(){
		FireEvent("end", 'end');
	});
});
