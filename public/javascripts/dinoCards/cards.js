var s_CARDCOUNT = 0;
var Card = function(){ 
	this.sprite;
	this.spritename;
	this.value;
	this.uservalue;
	this.cardId;
	this.position;
	this.element;
	this.faceup;
	
	// Communication Use
	this.tojson = function(){ 
		var output = { 
			'value': this.value,
			'uservalue': this.uservalue,
			'cardid': this.cardId,
			'position': this.position
		};	
		return output;
	}
	
	this.fromjson = function(data){ 
		for( var k in data ){ 
			switch( k ){ 
				case 'value':
					this.SetValue( data[k] );
					break;
				case 'uservalue':
					this.uservalue = data[k];
					break;
				case 'cardid': 
					this.cardId = data[k];
					break;
				case 'position':
					this.position = data[k];
					break;
			}
		}
	}
	
	// Constructors
	this.initialize = function( element ){ 
		this.cardId = s_CARDCOUNT;
		s_CARDCOUNT += 1;
		element.addSprite( "card-" + this.cardId, { 
			'width' : CARD_WIDTH,
			'height' : CARD_HEIGHT
		} );
		this.spritename = "card-" + this.cardId;
		this.sprite = $( "#card-" + this.cardId );
		this.faceup = true;
		this.position = [];
		this.position[0] = 0;
		this.position[1] = 0;
		this.position[2] = 0;
		this.element = element;
		this.sprite.click( ( function(card){ 
			return function(){ 
				card.Click();
			};
		} )(this) );
	}
	
	// Destructor
	this.destroy = function(){ 
		this.sprite.remove();
		delete this;
	}
	
	this.Hide = function(){ 
		this.sprite.hide(100);
	}
	
	this.Show = function(){ 
		this.sprite.show(100);
	}
	
	this.Click = function(){ 
		// TODO: show some animation
		var data = { 
			'sessionId' : sessionId,
			'card' : this.tojson()
		};
		FireEvent( "card clicked", data );
	}
	
	this.SetSprite = function( animation ){ 
		this.sprite.setAnimation( animation );
	}
	
	this.SetValue = function( value ){ 
		this.value = value;
		this.sprite.setAnimation( AnimationResource[ this.value + COUNT_UI ] );
	}	
		
	this.MovePosition = function( posx, posy, posz ){ 
		var x = posx || 0;
		var y = posy || 0;
		var z = posz || 0;
		this.SetPosition( 
			this.position[0] + x ,
			this.position[1] + y ,
			this.position[2] + z
		);
	}
	
	this.SetPosition = function( posx, posy, posz ){ 
		this.sprite.css( "left", posx + "px" );
		this.sprite.css( "top", posy + "px" );
		if( posz != undefined )
			this.sprite.css( "z-index", posz );
	}
	
	this.RotateAngle = function( angle ){ 
		// TODO: implement me!	
	}
	
	this.SetAngle = function( angle ){ 
		// TODO: implement me!
	}
	
	// Flips the card around (or not)
	this.Flip = function(){ 
		this.faceup = !this.faceup;
		if( this.faceup ){ 
			this.SetValue( this.value );
		}
		else{ 
			this.sprite.setAnimation( ID_CARDBACK );
		}
		this.Animate.flip(this.spritename);
	}	
		
	// TODO: implement me!
	this.Animate = { 
		flip : function(card){ 
			a.spin( [card],  "left", "", "", {
            	"value": "750ms",
            	"randomness": "0%",
            	"offset": "150ms"
        	});
		} ,
		glow : function(){ } ,
		vibrate : function(){ }
	};
}

