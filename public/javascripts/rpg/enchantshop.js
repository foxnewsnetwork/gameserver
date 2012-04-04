

var EnchantShop = function(){ 
	// element used to hold everything
	this.game;
	this.stage;
	// text to display
	this.textlabel;
	// related sprites
	this.shopsprites;
	this.shoptilesprites;
	this.shopitems;
	// related images
	this.shopimages;
	this.shoptileimages;
	this.shopitemimages;
	// item in question
	this.checkout;
	
	
	this.initialize = function(game){ 
		this.game = game;
		this.stage = new Group();
		/**
		* Shop Section
		*/
		// Step 0: Loading labels
		this.textlabel = new Label("");
		this.textlabel.font = "Arial 8px";
		this.textlabel.color = "rgb(221, 215, 85)";
		this.textlabel.x = 45;
		this.textlabel.y = 290;
		// Step 1: Loading the sprites
		this.shopsprites = {};
		this.shopsprites['container'] = new Sprite(187, 319);
		this.shopsprites['container'].x = 0;
		this.shopsprites['container'].y = 0;
		this.shopsprites['buybutton'] = new Sprite(46, 22);
		this.shopsprites['buybutton'].x = 125;
		this.shopsprites['buybutton'].y = 285;
		this.shopsprites['exitbutton'] = new Sprite(37, 14);
		this.shopsprites['exitbutton'].x = 140;
		this.shopsprites['exitbutton'].y = 33;
		this.shopsprites['itembutton'] = new Sprite(71, 24);
		this.shopsprites['itembutton'].x = 60;
		this.shopsprites['itembutton'].y = 55;
		this.shopsprites['logoicon'] = new Sprite(104, 41);
		this.shopsprites['logoicon'].x = 5;
		this.shopsprites['logoicon'].y = 5;
		this.shopsprites['pricetag'] = new Sprite(107, 21);
		this.shopsprites['pricetag'].x = 9;
		this.shopsprites['pricetag'].y = 286;
		this.shopitems = [];
		this.shoptilesprites = [];
		for( var k = 0; k < 20; k++ ){ 
			this.shoptilesprites.push( new Sprite( 42, 38 ) );
			this.shoptilesprites[k].x = (k % 4) * 42 + 11; 
			this.shoptilesprites[k].y = Math.floor( k / 4 ) * 38 + 85;
		}// end for loop
		for( var k = 0; k < 7; k++ ){ 
			this.shopitems.push( new Sprite( 34, 34 ) );
			this.shopitems[k].x = (k % 4) * 42 + 15; 
			this.shopitems[k].y = Math.floor( k / 4 ) * 38 + 89;
		} // end for loop
		
		// Step 2: Creating the images 14 x 30
		this.shopimages = {};
		this.shopimages['container'] = new Surface(187, 319);
		this.shopimages['container'].draw(game.assets['images/rpg/shopcontainer.jpg'], 0, 0, 187, 319, 0, 0, 187, 319); 
		this.shopimages['buybutton'] = new Surface(46, 22);
		this.shopimages['buybutton'].draw(game.assets['images/rpg/shopbuybutton.png'], 0, 0, 46, 22, 0, 0, 46, 22); 
		this.shopimages['exitbutton'] = new Surface(37, 14);
		this.shopimages['exitbutton'].draw(game.assets['images/rpg/shopexitbutton.png'], 0, 0, 37, 14, 0, 0, 37, 14); 
		this.shopimages['itembutton'] = new Surface(71, 24);
		this.shopimages['itembutton'].draw(game.assets['images/rpg/shopitembutton.png'], 0, 0, 71, 24, 0, 0, 71, 24); 
		this.shopimages['logoicon'] = new Surface(104, 41);
		this.shopimages['logoicon'].draw(game.assets['images/rpg/shoplogoicon.png'], 0, 0, 104, 41, 0, 0, 104, 41); 
		this.shopimages['pricetag'] = new Surface(107, 21);
		this.shopimages['pricetag'].draw(game.assets['images/rpg/shoppricetag.jpg'], 0, 0, 107, 21, 0, 0, 107, 21); 
		this.shoptileimages = [];
		this.shopitemimages = [];
		for( var k = 0; k < 7; k++ ){ 
			this.shopitemimages.push( new Surface( 34, 34 ) );
			var p1 = k * 34, p2 = p1 + 34;
			this.shopitemimages[k].draw(game.assets['images/rpg/item0.png'], p1, p1, p2, p2, 0, 0, p2, p2);
		}
		for( var k = 0; k < 20; k++ ){ 
			this.shoptileimages.push( new Surface( 42, 38 ) );
			this.shoptileimages[k].draw(game.assets['images/rpg/shopitemtile.png'], 0, 0, 42, 38, 0, 0, 42, 38); 
		}// end for loop
		
		// Step 3: setting them together
		for( var k in this.shopsprites ){ 
			this.shopsprites[k].image = this.shopimages[k];
		}
		for( var k = 0; k < 7; k++ ){ 
			this.shopitems[k].image = this.shopitemimages[k];
		}
		for( var k = 0; k < 20; k++ ){ 
			this.shoptilesprites[k].image = this.shoptileimages[k];
		}// end for loop
		
		// Step 3.5: Putting in UI
		this.shopsprites['exitbutton'].addEventListener( "touchend", (function(shop){ 
			return function(e){ shop.hide(); tooltip.hide(); };
		})(this) );
		this.shopsprites['exitbutton'].addEventListener( "touchstart", function(){ 
			tooltip.show( "Exit shop" );
		} );
		this.shopsprites['buybutton'].addEventListener( "touchend", (function(shop){ 
			return function(e){ 
				tooltip.hide();
				if( shop.checkout ){ 
					shop.stage.removeChild( shop.checkout );
					shop.checkout = undefined;
					shop.textlabel.text = "Sold!"
				} // end if
			}; // end return
		} )(this) ); // end addEventListener
		
		// Step 4: Putting into the group
		for( var k in this.shopsprites ){
			this.stage.addChild(this.shopsprites[k]);
		}
		for( var l = 0; l < this.shoptilesprites.length; l++ ){ 
			this.stage.addChild(this.shoptilesprites[l]);
		}
		for( var k = 0; k < this.shopitems.length; k++ ){ 
			this.stage.addChild( this.shopitems[k] );
			this.shopitems[k].addEventListener( "touchstart", (function(shop, k){ 
				return function(){ 
					if( shop.checkout == shop.shopitems[k] ){ 
						tooltip.hide();
						shop.textlabel.text = "";
						shop.checkout = undefined;
					} // end if
					else{
						tooltip.show( "<p>" + itemtext[k]['title'] + "</p><p>" + itemtext[k]['description'] + "</p>" );
						shop.textlabel.text = itemtext[k]['price'] + "g";
						shop.checkout = shop.shopitems[k];
					} // end else
				} ;
			})(this, k) );
		} // end for loop
		this.stage.addChild( this.textlabel );
	} // end initialize
	this.show = function(real){
		// Step 1.5: Loading in real items
		if( InGidioItems != undefined && real == true ){ 
			for( var k = 0 ; k < InGidioItems.length; k++ ){ 
				var j = k + 7;
				var rlitem = InGidioItems[k];
				rlitem.Size( 60,60 );
				rlitem.Move( ((j % 4 ) * 82 + 25), (Math.floor(j / 4 ) * 73 + 163) );
				rlitem.Show();
			} // end for loop
		} // end InGidioItems null check 
		EnchantShopFlag = true;
		this.game.rootScene.addChild( this.stage );
	}// this.show
	
	this.hide = function(){ 
		EnchantShopFlag = false;
		this.game.rootScene.removeChild( this.stage );
		if( InGidioItems != undefined ){ 
			for( var k = 0 ; k < InGidioItems.length; k++ ){ 
				var rlitem = InGidioItems[k];
				rlitem.Hide();
			} // end for loop
		} // end InGidioItems null check 
	}// this.hide
}// end EnchantShop
