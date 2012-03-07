var playerNumber = 3;	

var game = new MahjongGame();
game.initialize();
game.newgame();


/*
var faggot = function(){ 
	this.dostuff = function(){ 
		this.background1 = new $.gameQuery.Animation({imageURL: IMAGE_PATH + "tiles/0.png"});
		$("#playground").playground({ height: 200, width: 200} );
		$.playground().addGroup("niggers", { width: 200, height: 200} ).addSprite("background1", { animation: this.background1, width: 200, height: 200 } );
		$.playground().startGame( function(){ } );
		$("#mahjong-display").append("more niggers");	
	}
}
*/

$(function(){ 
/*
	
/*
	var me = new faggot();
	me.dostuff();
*/
/*
	$("#playground").playground( { width: GAME_WIDTH,  height: GAME_HEIGHT } );
	MahjongStaticInitialization();
	var mytile = new MahjongTileSprite();
	mytile.SetAs( 2,4 );
	mytile.SetAt(0, 0);
	mytile.SetAs( 1,2 );
	mytile.MoveTo(100, 100);
	$.playground().startGame(function(){ });
	$.playground().registerCallback( function(){
		mytile.MoveTo( (Math.random() - 0.5) * 5, (Math.random() - 0.5 )* 5 );
	} , 60);
*/	
} );


$(document).ready(function(){
	var graphics = new MahjongGraphics();
	graphics.initialize("playground");
	$("#endturn").mouseover( function(){ tooltip.show( "faggot" ); } );
	$("#endturn").mouseleave( function(){ tooltip.hide(  ); } );
	graphics.draw(game.tojson());	

});

