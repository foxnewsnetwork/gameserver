	var staticButtonId;
	var staticButtonGroup;
function MahjongButtonInit() {
	 staticButtonGroup = $.playground().addGroup( "buttons", { width: GAME_WIDTH, height: GAME_HEIGHT } ).end();;
	 staticButtonId = 0;
	};
var MahjongButtonSprite = function(){
	
	this.sprite;
	staticButtonId += 1;

	this.buttonId = staticButtonId;
	this.x;
	this.y;
	this.action;
	this.hide = function(){
		this.sprite.hide();
	}
	this.show = function(){
		this.sprite.show();
	}
	this.SetCallback = function( name, callback ){ 
		if( this.sprite == undefined ){ 
			alert( "You've tried to set a callback for a completely uninitiated tile, you dumbass" );
			return;
		}
	
		var eventinfo = { 
			'xpos': this.x,
			'ypos': this.y,
			'action': this.action
		};
		switch( name ){ 
			case 'click':
				this.sprite.click( function(){ 
					callback(eventinfo);
				} );
				break;
			case 'mouseover':
				this.sprite.mouseover( function(){ 
					callback(eventinfo);
				} );
				break;
			case 'mouseout':
				this.sprite.mouseout( function(){
					callback(eventinfo);
				} );
				break;
		}
	}
	
	
	this.set = function(xpos,ypos,action){ 
		var changed = false;
		this.x = xpos;
		this.y = ypos;
		if( this.x == undefined || this.y == undefined )
			return;
		else{
		this.action = action;
				this.sprite = staticButtonGroup.addSprite( "button" + this.buttonId, { 
					animation: new $.gameQuery.Animation( { 
						'imageURL': IMAGE_PATH + "buttons/" + this.action + ".png"
					} ),
					width: BUTTON_WIDTH,
					height: BUTTON_HEIGHT,
					posx: this.x,
					posy: this.y,
					posz: 99
				} ); 
				this.sprite = $( "#button" + this.buttonId );
			  
		} 
	}
} 
