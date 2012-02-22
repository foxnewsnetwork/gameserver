// Test code for stuff

var socket = io.connect('http://localhost');
socket.on('news', function (data) {
	$("#buttfuck").html('<p>Socket io working. yay!</p>');
	$("#buttfuck").append( data );
	socket.emit('my other event', { my: 'data' });
});

AddShopFunction( "open shop down", function(items){ 
	$("#buttfuck").html( "<img alt='nigger' src='" + items["picture_path"] + "' />" );
});

AddChatFunction( "chat down", function(data){ 
	$("#chat").append( "<p>" + "from: " + data["sessionId"] + " ==> " + data['message'] + "</p>" );
});

AddChatFunction( "join channel down", function(data){ 
	$("#chat").append( "<p>" + "from: server ==> you've joined " + data + "</p>" );
});

$(document).ready(function(){
	$("#shop").click(function(){
		$("#buttfuck").html( "request submitted" );
		GetShopItems();
	});
	
	$("#send-message").submit( function( ){ 
		PlayerChat( $("#message").val() );
		return false;
	});
	
	$("#join-channel").submit(function(){ 
		JoinChannel( $("#channel").val() );
		return false;
	});
} );


