/************************
* Declarations                     *
*************************/
var s_loadedCount = 0;
var AnimationResource = [];
var myboard = new CardBoard();
var mygui = new CardUI();
var myscore = 0;
var otherscore = 0;
var myflipped;
var hisflipped;
var a = alice.init();

function LoadResources( ){ 
	for( var k = 0; k < ANIMATION_COUNT; k++ ){ 
		AnimationResource.push( new $.gameQuery.Animation({
			// imageURL: IMAGE_PATH + k + ".png"
			imageURL : IMAGE_PATH + "greenbg.png"
		}) );
		// TODO: Gave notice to the player of the fileload
	}
	LoadGame();
}


function LoadGame(){
	// Step 1: Initialize the board, cards, and UI
	$("#game").playground({
		'width': GAME_WIDTH,
		'height': GAME_HEIGHT
	});
	
	var faggot1 = $.playground().addGroup( "game-ui", { 
		'width': GAME_WIDTH,
		'height': GAME_HEIGHT
	} );
	
	var faggot2 = $.playground().addGroup( "game-board", { 
		'width': BOARD_WIDTH,
		'height': BOARD_HEIGHT
	} );
	
	myboard.initialize( faggot1 );
	mygui.initialize( faggot2 );
	
	// Step 2: Connect up to the game server
	JoinRoom();
	
	// Step 3: Start it
	$.playground().startGame();
}

/**************************
* Game Server Client Setup *
***************************/
AddGameFunction( "join room down", function(roomdata){ 
	var playerid = roomdata['sessionId'];
	if( playerid == sessionId)
		$("#debug").append( "You have joined a game. " );
	else
		$("#debug").append( playerid + " has joined the game. " );
} );

AddGameFunction( "room stat down", function(roomstat){ 
	if( roomstat['population'] == 2 && roomstat['started'] != false ){ 
		$("#debug").append( "Game started" );
		StartGame( );
	}
	if( roomstat['population'] == 1 && roomstat['started']){ 
		FireEvent( "game over", currentRoom );
	}
} );

AddGameFunction( "start game down", function( data ){ 
	$("#debug").append( " start game down " );
	FireEvent( 'request game sync', myboard.tojson() );
} );

AddGameFunction( "request game sync", function(origin, event){
	alert( JSON.stringify( myboard.tojson() ) );
	myboard.fromjson( event );
	
} );

AddGameFunction( "player scored", function( origin, event ){ 
	var playerid = origin;
	var card1 = myboard.FindCard( event['card1'] );
	var card2 = myboard.FindCard( event['card2'] );
	
	if( playerid == sessionId )
		myscore += 1;
	else
		otherscore += 1;
	card1.Hide();
	card2.Hide();
} );

AddGameFunction( "player missed", function( origin, event ){ 
	var playerid = origin;
	var card1 = myboard.FindCard( event['card1'] );
	var card2 = myboard.FindCard( event['card2'] );
	
	card1.Flip();
	card2.Flip();
} );

AddGameFunction( "card clicked", function(origin, event){ 
	var playerid = origin;
	var card = event['card'];
	var thecard = myboard.FindCard( card );
	if( playerid == sessionId ){ 
		if( myflipped == undefined && thecard != hisflipped ){ 
			myflipped = thecard;
			myflipped.Flip();
		}
		else if( myflipped != undefined && thecard != hisflipped ){ 
			myflipped.Flip();
			if( CardLogic.CheckMatch( myflipped, thecard ) ){ 
				FireEvent( "player scored", { 
					'sessionId' : sessionId,
					'card1': myflipped.tojson() ,
					'card2': thecard.tojson()
				} );
			}
			else{ 
				FireEvent( "player missed", { 
					'sessionId' : sessionId,
					'card1': myflipped.tojson() ,
					'card2': thecard.tojson()
				} );
			}
		}
		else{ 
			if( hisflipped == undefined && thecard != myflipped ){ 
				hisflipped = thecard;
				thecard.Flip();
			}
			else if( hisflipped != undefined && thecard != myflipped ){ 
				thecard.Flip();
			}	
		}	
	}
	
} );

AddGameFunction( "game over", function(origin, event){ 
	$("#debug").append( "Game over" );
	LeaveRoom( );
	mygui.PromptNewGame();
} );
