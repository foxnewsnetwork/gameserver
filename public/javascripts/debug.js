// Test code for stuff

var game = new MahjongGame();
var board = new MahjongBoard();
var p1 = new MahjongPlayer();
var p2 = new MahjongPlayer();
var p3 = new MahjongPlayer();
var p4 = new MahjongPlayer();

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
	$("#mahjong-game").click( function(){ 
		game.initialize();
		game.newgame();
		$("#mahjong-display").html( game.tohtml() );
	} );
	$("#mahjong-draw").click( function(){ 
		var player = game.getactiveplayer();
		var board = game.board;
		
		player.drawtile( board );
		$("#mahjong-display").html( game.tohtml() );
	} );	
	
	$("#mahjong-players").click( function(){ 
		p1.drawtiles( board, 13 );
		p2.drawtiles( board, 13 );
		p3.drawtiles( board, 13 );
		p4.drawtiles( board, 13 );
		p1.sorthand();
		p2.sorthand();
		p3.sorthand();
		p4.sorthand();
		$("#mahjong-display").html( p1.tohtml() );
		$("#mahjong-display").append( p2.tohtml() );
		$("#mahjong-display").append( p3.tohtml() );
		$("#mahjong-display").append( p4.tohtml() );
		$("#mahjong-display").append( board.tohtml() );
	});
	
	$("#mahjong-generate").click( function(){
		board.newboard();
		$("#mahjong-display").html( board.tohtml() );
	} );
	
	$("#mahjong-shuffle").click( function(){ 
		board.shuffle();
		$("#mahjong-display").html( board.tohtml() );
	})
	
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


