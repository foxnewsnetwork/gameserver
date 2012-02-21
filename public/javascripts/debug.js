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

$(document).ready(function(){
	$("#shop").click(function(){
		$("#buttfuck").html( "request submitted" );
		socket.emit( "open shop up", "nothing");
	});
} );


