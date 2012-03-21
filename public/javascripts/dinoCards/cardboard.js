var CardBoard = function(){ 
	this.sprite;
	this.cards;
	this.element;
	
	this.click = function( card ){ 
		// TODO: some animation
	}
	
	this.FindCard = function( card ){ 
		var value = card['value'];
		return this.cards['value'];
	}
	
	this.initialize = function( element ){ 
		this.element = element;
		this.element.addSprite( "card-board" , { 
			'width': BOARD_WIDTH,
			'height': BOARD_HEIGHT,
			'posx': BOARD_POSX,
			'posy': BOARD_POSY
		} );
		this.cards = [];
		var k = 0, j = 0;
		for( k = 0; k < CARD_COUNT; k++ ){ 
			this.cards.push( new Card() );
			this.cards[k].initialize( element );
			var posx = ( 5 + CARD_WIDTH ) * ( k % CARD_COUNT_X );
			var posy = ( 5 + CARD_HEIGHT ) * Math.floor( k / CARD_COUNT_X );
			this.cards[k].SetPosition( posx, posy, ZINDEX_UI );
			this.cards[k].SetValue( k );
		}
	}
	this.tojson = function(){
		var output = { 
			'cards' : []
		}
		for( var k = 0; k < cards.length; k++ ){ 
			output['cards'].push( this.cards[k].tojson() );
		}
		return output;
	}
	
	this.fromjson = function(data){
		this.cards = [];
		for( var k = 0; k < data['cards'].length; k++ ){ 
			this.cards.push( new Card() );
			this.cards[k].initialize( this.element ); 
			this.cards[k].fromjson( data['cards'][k] );
		}	
	}
	
	this.refill = function(){ }
	this.shuffle = function(){ }
}

