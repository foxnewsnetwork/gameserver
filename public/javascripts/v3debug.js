var game = new MahjongGame();
var actions;

var socket = io.connect('http://localhost');

AddShopFunction( "open shop down", function(items){ 
	$("#debug-info").html( "<img alt='nigger' src='" + items["picture_path"] + "' />" );
});

AddChatFunction( "chat down", function(data){ 
	$("#chat").append( "<p>" + "from: " + data["sessionId"] + " ==> " + data['message'] + "</p>" );
});

AddChatFunction( "join channel down", function(data){ 
	$("#chat").append( "<p>" + "from: server ==> you've joined " + data + "</p>" );
});

AddChatFunction( "channel stat down", function(data){ 
	$("#channel-stats").html( "<p>Currently, " + data['population'] + ' people in channel ' + data['channelId'] );
} );

AddGameFunction( "game event down", function(data){ 
	var eventname = data['name'];
	var eventdata= data['event'];	
} );

function manageUI(){
	
}

$(document).ready(function(){
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

});
