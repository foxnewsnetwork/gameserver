// Test code for stuff

var socket = io.connect('http://localhost');
socket.on('news', function (data) {
	$("#buttfuck").html('<p>Socket io working. yay!</p>');
	$("#buttfuck").append( data );
	socket.emit('my other event', { my: 'data' });
});
