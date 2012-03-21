
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
	var staticButtonGroup;
	this.setupButtons = function(){
		//staticButtonGroup = $.playground().addGroup( "buttons", { width: GAME_WIDTH, height: GAME_HEIGHT } ).end();
		//create draw button
		drawButton = new MahjongButtonSprite();
		drawButton.set(0,0,"draw");
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
		discardButton.set(0,BUTTON_HEIGHT,"discard");
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
		endTurnButton.set(0,2*BUTTON_HEIGHT,"endturn");
		endTurnButton.SetCallback( 'mouseover', function(event){ 
			tooltip.show( event['action'] );
			} );
		endTurnButton.SetCallback( 'mouseout', function(event){
			tooltip.hide();
			} );
		endTurnButton.SetCallback("click", function(event){
			endTurn();
		});	
		drawButton.hide();
		discardButton.hide();
		endTurnButton.hide();
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
			x += 1;
		}
		
	}
}

