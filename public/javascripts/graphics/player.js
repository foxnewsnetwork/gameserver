
var MahjongGraphicsPlayer = function(){ 
	this.ptileset;
	this.pickedTile;
	
	
	 this.setPick = function(num){
		 if(this.pickedTile != undefined){
				xpos = X_PLAYER + this.pickedTile*TILE_WIDTH;
				ypos = Y_PLAYER;
				this.ptileset[this.pickedTile].SetAt(xpos, ypos);	
			}
			xpos2 = X_PLAYER + num*TILE_WIDTH;
			ypos2 = Y_PLAYER - 20;
			this.ptileset[num].SetAt(xpos2, ypos2);

			
			this.pickedTile = num;
			
	}
	 this.resetPick = function(){
		 xpos = X_PLAYER + this.pickedTile*TILE_WIDTH;
			ypos = Y_PLAYER;
			this.ptileset[this.pickedTile].SetAt(xpos, ypos);	
			
			this.pickedTile = undefined;
	 }
	this.returnTile = function(){
		return this.pickedTile;
	}
	this.initialize = function(element){ 
		this.ptileset = [];
		return this;
	}
	function objToString (obj) {
	    var str = '';
	    for (var p in obj) {
	        if (obj.hasOwnProperty(p)) {
	            str += p + '::' + obj[p] + '\n';
	        }
	    }
	    return str;
	}
	this.draw = function( playerstate ){ 
	
		var hand = playerstate['hand'];
		var hidden = hand['hidden'];
		var exposed = hand['exposed'];
		// step 1: we show the hidden hand
		var k, xpos, ypos;
		for( k = 0; k < hidden.length; k++){ 
			if( this.ptileset[k] == undefined ){ 
				if(k == 14)
					alert("should be here twice");
					
				var atile = new MahjongTileSprite();
				xpos = X_PLAYER + k*TILE_WIDTH;
				ypos = Y_PLAYER;
				atile.SetAs(hidden[k]['suit'], hidden[k]['value'],k);
				atile.SetAt(xpos, ypos);
				atile.SetCallback( 'mouseover', function(event){ 
					tooltip.show( tiletohtml(event['suit'], event['value'] ) );
				} );
				atile.SetCallback( 'mouseout', function(event){
					tooltip.hide();
				} );
				/* atile.SetCallback( "click", function(event){
					 alert("clicked tiles" + event['suit'] +" "+ event['value'] );
					// discardTile( tiletohtml(event['suit'], event['value'] ));
					 });*/
				this.ptileset.push( atile );

			}
			else{ 
			
				this.ptileset[k].SetAs( hidden[k]['suit'], hidden[k]['value'],k );
				
				this.ptileset[k].SetCallback( 'mouseover', function(event){ 
					tooltip.show( tiletohtml(event['suit'], event['value'] ) );
					//tooltip.show(event['handId']);
				} );
				this.ptileset[k].SetCallback( 'mouseout', function(event){
					tooltip.hide();
				} );
				this.ptileset[k].SetCallback( "click", function(event){
					//alert(tiletohtml(event['suit'], event['value'] ) );
					deleteTile = tiletohtml(event['suit'], event['value'] );
					//$("#clickedtile").append(deleteTile);
					$("#tile").val(deleteTile);
					deleteTileSpot = event['handId'];
					//Click discarding temporarily disabled.
					//discardTile(deleteTile);
					setPlayerPickTile(deleteTileSpot);
					 });
			}
		}
		
		// step 2: show the exposed hand
		var j;
		for( j = 0; j < exposed.length; j++){ 
			
			if( this.ptileset[k+j] == undefined ){ 
				xpos = X_PLAYER + 15 + (k+j)*TILE_WIDTH;
				ypos = Y_PLAYER; - 25;
				atile.SetAs(exposed[j]['suit'], exposed[j]['value']);
				atile.SetAt(xpos, ypos);
				atile.SetCallback( 'mouseover', function(event){ 
					tooltip.show( tiletohtml(event['suit'], event['value'] ) );
				} );
				atile.SetCallback( 'mouseout', function(event){
					tooltip.hide();
				} );
				atile.SetCallback( "click", PlayerTileClick(atile) );
				this.ptileset.push( atile );
			}
			else{ 
				atile.SetAs(exposed[j]['suit'], exposed[j]['value']);
				atile.SetCallback( 'mouseover', function(event){ 
					tooltip.show( tiletohtml(event['suit'], event['value'] ) );
				} );
				atile.SetCallback( 'mouseout', function(event){
					tooltip.hide();
				} );
				atile.SetCallback( "click", PlayerTileClick(atile) );
			}
		}
		
		// Step 3: deleting extra crap
		var m = k+j;
		while( m < this.ptileset.length ){ 
			if(this.ptileset[m] != undefined)
			{this.ptileset[m].destroy();
			this.ptileset.splice(m,1);}
			m += 1;
		}	
	}
}

