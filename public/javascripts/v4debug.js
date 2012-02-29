var ActiveNumber = 0;
var PlayerScore = 0;
var GameStarted = false;

function unsort( vec ){ 
	var nig = vec;
	var temp;
	var y;
	for( var x in nig ){ 
		y = Math.floor( Math.random() * vec.length );
		temp = nig[x];
		nig[x] = nig[y];
		nig[y] = temp;
	}
	return nig;
}

// Loads 25 buttons in a square
function LoadButtons(){ 
	function tempFun( num ){ 
		return function() { FireEvent( "clicked", num ); }
	};
	var kvec = unsort( [0,1,2,3,4] );
	var jvec = unsort( [0,1,2,3,4] );
	var k, j;
	$("#content").append( "<ul class='stuff'>" );
	for(var a in kvec ) {
		k = kvec[a];
		$("#content").append( "<li class='nig'>" );
		for( var b in jvec ) {
			j = jvec[b];
			var number = 5*k + j;
			$("#content").append( "<button id='button" + (number) + "'>" + (number) + "</button>" );
			$("#button" + (number) ).click( tempFun(number) );
		}
		$("#content").append( "</li>" );
	}
	$("#content").append( "</ul>" );
	$("#activeNumber").html("<h1>0</h1>");
}

/*
 eventdata = { 
 	'clickedNumber' : #
 }
*/
AddGameFunction( "clicked", function(originId, eventdata){ 
	if( eventdata == ActiveNumber ){ 
		FireEvent( "game state", ActiveNumber );
		ActiveNumber++;
		if( originId == sessionId ){ 
			PlayerScore++;
		}
	}
} );

/*
eventdata = { 
	clickedNumber: #
}
*/
AddGameFunction( "game state", function(originId, eventdata){ 
	GameStarted = true;
	$("#status").html( "<h1>In-Game!</h1>" );
	for( var x = 0; x <= eventdata; x++ ){ 
		$( "#button" + x ).hide();
	}
	ActiveNumber = eventdata + 1;
	$("#activeNumber").html( "<h2>" + ActiveNumber + "</h2>" );
} );

AddGameFunction( "join game down", function(data){ 
	if( data['sessionId'] == sessionId )
		$("#debug").html( "You have joined " + data['roomId'] );
	else
		$("#debug").html( data['sessionId'] + " has joined " + data['roomId'] );
	if( GameStarted == false )	
		$("#status").html( "<h1>waiting for game to start...</h1>" );
} );

AddGameFunction( "room stat down", function(data){ 
	$("#debug").html( data['population'] + " Players in " + data['roomId'] + ": ");
	for(var k in data['people'] )
		$( "#debug" ).append( "<p>" + data['people'][k] + "</p>" );
} );

$(document).ready(function(){
	$("#join").click(function(){
		LoadButtons();
		JoinRoom();
		$("#join").hide();
	});
});
