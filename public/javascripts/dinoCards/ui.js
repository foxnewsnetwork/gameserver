var CardUI = function(){ 
	this.element;
	this.sprite;
	this.timersprite;
	this.scoresprite;
	
	this.initialize = function(element){
		this.element = element;
		element.addSprite( "game-ui", {
			'width': GAME_WIDTH,
			'height': GAME_HEIGHT - BOARD_HEIGHT,
			'posx': 0,
			'posy': 0
		} );
		this.sprite = $("#game-ui");	
		element.addSprite( "game-ui-timer", { 
			width : TIMER_WIDTH,
			height : GAME_HEIGHT - BOARD_HEIGHT,
			posx : 5,
			posy : 0
		} );
		this.timersprite = $( "#game-ui-timer" );
		element.addSprite( "game-ui-score", { 
			width : SCORE_WIDTH,
			height : GAME_HEIGHT - BOARD_HEIGHT,
			posx : GAME_WIDTH - SCORE_WIDTH - 5 ,
			posy : 0
		} );
		this.scoresprite = $( "#game-ui-score" );
		
		this.sprite.setAnimation( AnimationResource[ID_UIBG] );
		this.timersprite.setAnimation( AnimationResource[ID_UITIMER] );
		this.scoresprite.setAnimation( AnimationResource[ID_UISCORE] );
	}
	
	this.SetTimer = function( value ){ 
		this.timersprite.html( "<h3>" + value + "</h3>" );
	}
	
	this.SetScore = function( value ){ 
		this.scoresprite.html( "<h3>" + value + "</h3>" );
	}
	
	this.PromptNewGame = function(){ 
		
	}
}
