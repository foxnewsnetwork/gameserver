/*****************************
* Drawing with gameQuery          *
******************************/
var MahjongGraphics = function(){ 
	this.background = new MahjongGraphicsBackground();
	this.ui = new MahjongGraphicsUI();
	this.board = new MahjongGraphicsBoard();
	this.player = new MahjongGraphicsPlayer();
	
	this.initialize = function( element ){ 
		// Initializing the gameQuery playground
		$("# "+ element).playground( { 
			'height': GAME_HEIGHT,
			'width': GAME_WIDTH
		} );
		this.background.initialize( element );
		this.board.initialize( element );
		this.player.initialize( element );	
		// this.ui.initialize( element );
	}
	
	// gamestate is a json file
	this.draw = function(gamestate){
		this.board.draw(gamestate['board']);
		this.player.draw(gamestate['players'][playerNumber]);
	}
}


