var playerNumber = 3;	
var graphics;
game.initialize();
var count = 0;

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
	$("#playground").playground( { width: GAME_WIDTH,  height: GAME_HEIGHT } );
	
	$.playground().startGame(function(){
	
	});
	$.playground().registerCallback( function(){
		if(game.begun){
			graphics.draw(game.tojson());

			}
			else {
				//draw a blank table.
	
			}
		} ,60);
	
} );
$(document).ready(function(){

	graphics = new MahjongGraphics();
	graphics.initialize("playground");
		$("#endturn").mouseover( function(){ tooltip.show( "End your turn" ); } );
		$("#endturn").mouseleave( function(){ tooltip.hide(  ); } );
		//graphics.draw(game.tojson());	

	});


