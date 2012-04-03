
var MahjongGraphicsBoard = function(){ 
	this.btileset = [];
	
	this.initialize = function(element){ 
		this.btileset = [];
		// Laying down the sprite locations placeholders
		var xpos, ypos, stuff;
		for( var k = 0; k < 5; k++ ){ 
			for( var j = 0; j < 9; j++){
				var temptile = new MahjongTileSprite();
				xpos = Math.floor((j +9*k)/TILE_PER_COL) * TILE_WIDTH  + X_BOARD;
				ypos = j%TILE_PER_COL * TILE_HEIGHT  + Y_BOARD; 
				//xpos = X_BOARD + k * TILE_WIDTH;
				//ypos = Y_BOARD + j * TILE_HEIGHT;
				//stuff = "btile-" + (k*9 + j);
				temptile.SetAt(xpos, ypos);
				//this.btileset.push( temptile );
			}
		}
		return this;
	}
	var drawButton;
	var discardButton;
	var endTurnButton;
	var ponButton;
	var staticButtonGroup;
	var chiButton;
	var kanButton;
	this.setupButtons = function(){
		//staticButtonGroup = $.playground().addGroup( "buttons", { width: GAME_WIDTH, height: GAME_HEIGHT } ).end();
		//create draw button
		drawButton = new MahjongButtonSprite();
		drawButton.set(BUTTONS_XPOSITION,BUTTONS_YPOSITION,"draw");
		drawButton.SetCallback( 'mouseover', function(event){ 
		tooltip.show( event['action'] );
		} );
		drawButton.SetCallback( 'mouseout', function(event){
		tooltip.hide();
		} );
		drawButton.SetCallback( 'click', function(event){
			drawTile();
			} );
		
		discardButton = new MahjongButtonSprite();
		discardButton.set(BUTTONS_XPOSITION,BUTTONS_YPOSITION + BUTTON_HEIGHT,"discard");
		discardButton.SetCallback( 'mouseover', function(event){ 
			tooltip.show( event['action'] );
			} );
		discardButton.SetCallback( 'mouseout', function(event){
			tooltip.hide();
			} );
		discardButton.SetCallback( 'click', function(event){
			discardTile();
			} );
			
		endTurnButton = new MahjongButtonSprite();
		endTurnButton.set(BUTTONS_XPOSITION,BUTTONS_YPOSITION + (2*BUTTON_HEIGHT),"endturn");
		endTurnButton.SetCallback( 'mouseover', function(event){ 
			tooltip.show( event['action'] );
			} );
		endTurnButton.SetCallback( 'mouseout', function(event){
			tooltip.hide();
			} );
		endTurnButton.SetCallback("click", function(event){
			endTurn();
		});	
		
		ponButton = new MahjongButtonSprite();
		ponButton.set(BUTTONS_XPOSITION + BUTTON_WIDTH, BUTTONS_YPOSITION,"pon");
		ponButton.SetCallback( 'mouseover', function(event){ 
			tooltip.show( event['action'] );
			} );
		ponButton.SetCallback( 'mouseout', function(event){
			tooltip.hide();
			} );
		ponButton.SetCallback("click", function(event){
			pon();
		});	
		
		chiButton = new MahjongButtonSprite();
		chiButton.set(BUTTONS_XPOSITION + BUTTON_WIDTH,BUTTONS_YPOSITION + BUTTON_HEIGHT,"chi");
		chiButton.SetCallback( 'mouseover', function(event){ 
			tooltip.show( event['action'] );
			} );
		chiButton.SetCallback( 'mouseout', function(event){
			tooltip.hide();
			} );
		chiButton.SetCallback("click", function(event){
			chi();
		});
		
		kanButton = new MahjongButtonSprite();
		kanButton.set(BUTTONS_XPOSITION + BUTTON_WIDTH,BUTTONS_YPOSITION + (2 * BUTTON_HEIGHT),"kan");
		kanButton.SetCallback( 'mouseover', function(event){ 
			tooltip.show( event['action'] );
			} );
		kanButton.SetCallback( 'mouseout', function(event){
			tooltip.hide();
			} );
		kanButton.SetCallback("click", function(event){
			kan();
		});
	
		ronButton = new MahjongButtonSprite();
		ronButton.set(BUTTONS_XPOSITION + (2 * BUTTON_WIDTH),BUTTONS_YPOSITION,"ron");
		ronButton.SetCallback( 'mouseover', function(event){ 
			tooltip.show( event['action'] );
			} );
		ronButton.SetCallback( 'mouseout', function(event){
			tooltip.hide();
			} );
		ronButton.SetCallback("click", function(event){
			ron();
		});
		commitButton = new MahjongButtonSprite();
		commitButton.set(BUTTONS_XPOSITION + (2 * BUTTON_WIDTH),BUTTONS_YPOSITION + BUTTON_HEIGHT,"commit");
		commitButton.SetCallback( 'mouseover', function(event){ 
			tooltip.show( event['action'] );
			} );
		commitButton.SetCallback( 'mouseout', function(event){
			tooltip.hide();
			} );
		commitButton.SetCallback("click", function(event){
			commitChi();
		});
		drawButton.hide();
		discardButton.hide();
		endTurnButton.hide();
		ponButton.hide();
		chiButton.hide();
		kanButton.hide();
		ronButton.hide();
		commitButton.hide();
	}
	this.actionsDraw = function(){
		drawButton.show();
		discardButton.hide();
		endTurnButton.hide();
	}
	this.actionsDiscard = function(){
		discardButton.show();
		drawButton.hide();
		endTurnButton.hide();
	}
	this.actionsEndTurn = function(){
		endTurnButton.show();
		discardButton.hide();
		drawButton.hide();
	}
	this.actionsInactive = function(){
		drawButton.hide();
		discardButton.hide();
		endTurnButton.hide();	
	}
	this.actionsPon = function(){
		ponButton.show();
	}
	this.actionsDeactivatePon = function(){
		ponButton.hide();
	}
	this.actionsChi = function(){
		chiButton.show();
	}
	this.actionsDeactivateChi = function(){

		chiButton.hide();
	}
	this.actionsKan = function(){
		kanButton.show();
	}
	this.actionsDeactivateKan = function(){
		kanButton.hide();
	}
	this.actionsRon = function(){
		ronButton.show();
	}
	this.actionsDeactivateRon = function(){
		ronButton.hide();
	}
	this.actionsCommit = function(){
		commitButton.show();
	}
	this.actionsDeactivateCommit = function(){
		commitButton.hide();
	}
	// remember, json files
	this.draw = function( boardstate ){ 
		var discard = boardstate['discardTiles'];
		
		var x, xpos, ypos;
		
	

		for( x = 0; x < discard.length; x++ ){ 
			var mytile = discard[x];
	//		if(discard.length >0)
//			alert(tiletohtml(mytile['suit'],mytile['value']));
			if( this.btileset[x] == undefined ){ 
				var atile = new MahjongTileSprite();
				xpos = Math.floor(x/TILE_PER_COL) * TILE_WIDTH + X_BOARD;
				//$("#debug").append( " xpos: " + xpos + " mathfloor " + Math.floor(x/6) );
				ypos = x%TILE_PER_COL * TILE_HEIGHT + Y_BOARD;
				atile.SetAs(mytile['suit'], mytile['value']);

				atile.SetAt(xpos, ypos);
				
				/*atile.SetCallback( 'mouseover', function(event){ 
					tooltip.show( tiletohtml(event['suit'], event['value'] ) );
				} );
				atile.SetCallback( 'mouseout', function(event){
					tooltip.hide();
				} );*/
				// atile.SetCallback( "click", function(event){ alert("you're a fag"); } );
				this.btileset.push( atile );
				
			}
			else{ 
				this.btileset[x].SetAs(mytile['suit'], mytile['value']);
				/*atile.SetCallback( 'mouseover', function(event){ 
					tooltip.show( tiletohtml(event['suit'], event['value'] ) );
				} );
				atile.SetCallback( 'mouseout', function(event){
					tooltip.hide();
				} );*/
				// atile.SetCallback( "click", function(event){ alert("you're a fag"); } );
				//$("#debug").append( " xpos: " + xpos + " mathfloor " + Math.floor(x/6) );
			}
		}
		
		while( x < this.btileset.length ){ 
			this.btileset[x].destroy();
			this.btileset.splice(x,1);
			x += 1;
		}
		
	}
}

