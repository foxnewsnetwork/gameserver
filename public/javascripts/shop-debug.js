var playerToken = 1;

var PATH_NAME = "http://crunchymall.com/",
	SHOP_ID = "indigio_shop" ,
	SHOP_WIDTH = 480 ,
	SHOP_HEIGHT = 220 ,
	EXIT_WIDTH =  75 ,
	EXIT_HEIGHT =  75 ,
	ITEMS_PER_SHOP = 10 ,
	ITEM_TILE_HEIGHT = 75,
	ITEM_TILE_WIDTH = 75 ,
	SHOP_EASY_MODE = false ,
	SHOP_BGCOLOR = "rgb( 176, 209, 224 )";

function RefreshConstants( width, height ){ 
	return;
	if( SHOP_EASY_MODE )
		return;
	SHOP_WIDTH = width;
	SHOP_HEIGHT = height;
	EXIT_WIDTH =  SHOP_WIDTH / 10;
	EXIT_HEIGHT =  SHOP_WIDTH / 10;
	ITEM_TILE_HEIGHT = SHOP_WIDTH / 10 - 10;
	ITEM_TILE_WIDTH = SHOP_WIDTH / 10 - 10;
}

/**********************
* Tooltip class       *
**********************/
var tooltip = function(){
 var id = 'tt';
 var top = 3;
 var left = 3;
 var maxw = 300;
 var speed = 10;
 var timer = 20;
 var endalpha = 95;
 var alpha = 0;
 var tt,t,c,b,h;
 var ie = document.all ? true : false;
 return{
  show:function(v,w){
   if(tt == null){
    tt = document.createElement('div');
    tt.setAttribute('id',id);
    tt.style.zindex = 999;
    t = document.createElement('div');
    t.style.zindex = 999;
    t.setAttribute('id',id + 'top');
    c = document.createElement('div');
    c.style.zindex = 999;
    c.setAttribute('id',id + 'cont');
    b = document.createElement('div');
    b.style.zindex = 999;
    b.setAttribute('id',id + 'bot');
    tt.appendChild(t);
    tt.appendChild(c);
    tt.appendChild(b);
    document.body.appendChild(tt);
    tt.style.opacity = 0;
    tt.style.filter = 'alpha(opacity=0)';
    document.onmousemove = this.pos;
   }
   tt.style.display = 'block';
   c.innerHTML = v;
   tt.style.width = w ? w + 'px' : 'auto';
   if(!w && ie){
    t.style.display = 'none';
    b.style.display = 'none';
    tt.style.width = tt.offsetWidth;
    t.style.display = 'block';
    b.style.display = 'block';
	//$("#faggot").html("we're in boss!");
   }
  if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
  h = parseInt(tt.offsetHeight) + top;
  clearInterval(tt.timer);
  tt.timer = setInterval(function(){tooltip.fade(1)},timer);
  },
  pos:function(e){
   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
   tt.style.top = (u - h) + 'px';
   tt.style.left = (l + left) + 'px';
   //$("#faggot").html( (u - h) + 'px' + " and " + (l + left) + 'px' );
  },
  fade:function(d){
   var a = alpha;
   if((a != endalpha && d == 1) || (a != 0 && d == -1)){
    var i = speed;
   if(endalpha - a < speed && d == 1){
    i = endalpha - a;
   }else if(alpha < speed && d == -1){
     i = a;
   }
   alpha = a + (i * d);
   tt.style.opacity = alpha * .01;
   tt.style.filter = 'alpha(opacity=' + alpha + ')';
  }else{
    clearInterval(tt.timer);
     if(d == -1){tt.style.display = 'none'}
  }
 },
 hide:function(){
  clearInterval(tt.timer);
   tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
  }
 };
}();

/**********************
* Shop Class                     *
**********************/


var IndigioShop = function(){
	this.container;
	this.flash;
	this.mall;
	this.items;
	this.itemtiles;
	this.exit;
	this.tabs;
	this.initializationFlag = false;
	
	// private variables
	this.itemAnimations;
	this.itemtileAnimation;
	this.lockedAnimation;
	this.vacantAnimation;
	this.exitAnimation;
	
	this.initialize = function( gamedata ){ 
		if( this.initializationFlag )
			return;
		if( gamedata == undefined )
			gamedata = [];
		var shopwidth = gamedata['shopwidth'];
		var shopheight = gamedata['shopheight'];
		var divid = gamedata['elementid'];
		var shopx = gamedata['shopx'], shopy = gamedata['shopy'];
		
		if( shopwidth == undefined )
			shopwidth = SHOP_WIDTH;
		if( shopheight == undefined )
			shopheight = SHOP_HEIGHT;
		if( divid == undefined )
			divid = 'body';
		if( shopx == undefined )
			shopx = window.innerWidth / 2 - SHOP_WIDTH + window.pageXOffset;
		if( shopy == undefined )
			shopy = window.innerHeight - SHOP_HEIGHT + window.pageYOffset;
		
		// Refreshing stuff
		RefreshConstants( shopwidth, shopheight );	
		
		// Initialization
		this.lockedAnimation = new $.gameQuery.Animation( { 
			imageURL: PATH_NAME + "images/shopicons/locked.png" 
		} );
		
		this.vacantAnimation = new $.gameQuery.Animation({
			imageURL: PATH_NAME + "images/shopicons/vacant.png"
		});
		this.approveAnimation = new $.gameQuery.Animation({
			imageURL: PATH_NAME + "images/shopicons/approve.png"
		});
		this.exitAnimation = new $.gameQuery.Animation({ 
			imageURL: PATH_NAME + "images/shopicons/Close.png",
			width: EXIT_WIDTH,
			height: EXIT_HEIGHT,
		} );
		this.itemtileAnimation = new $.gameQuery.Animation({
			imageURL: PATH_NAME + "images/shopicons/itemicon.png"
		});
		
		
	
		// Creating the shop div
		var shopid = SHOP_ID;
		$( divid ).append( "<div id='" + shopid + "'></div>" );
		this.container = $( "#" + shopid );
		this.container.playground( { 
			width: shopwidth, 
			height: shopheight 
		} );
		
		// Setting up flash messages
		this.container.addGroup( shopid + "-flashcontainer", { 
			width : shopwidth,
			height : shopheight
		} ).addSprite( shopid + "-flash", { 
			'width': shopwidth,
			'height': shopheight / 4 ,
			'posx': 0,
			'poxy': shopheight / 2 - 25
		} );
		this.flash = $( "#" + shopid + "-flash" );
		this.flash.css( "z-index", 555 );
		this.flash.css( "background-color", "rgb( 150, 160, 80 )" );
		this.flash.hide();
		
		
		// setting up the mall
		this.mall = $.playground().addGroup( shopid + "-mall", { 
			width : shopwidth,
			height : shopheight
		} );
		this.mall.addSprite( shopid + "-exit", {
			'width' : EXIT_WIDTH , 
			'height' : EXIT_HEIGHT ,
			'posx' : shopwidth - EXIT_WIDTH - 5 ,
			'posy' : shopheight - EXIT_HEIGHT - 5 
		} );
		this.exit = $( "#" + shopid + "-exit" );
		this.exit.setAnimation( this.exitAnimation );
		
		// Setting up the login and confirmation tabs
		this.tabs = {};
		this.tabs['confirmation'] = this.container.addGroup( shopid + "-tabs-confirmation", { 
			width: shopwidth,
			height: shopheight
		} );
		this.tabs['confirmation'].addSprite( shopid + "-tabs-confirmation-yes", { 
			animation: this.approveAnimation,
			width: EXIT_WIDTH,
			height: EXIT_HEIGHT,
			posx: shopwidth - 2 * EXIT_WIDTH , //shopwidth - 2 * EXIT_WIDTH,
			posy: shopheight - EXIT_HEIGHT - 5
		} );
		this.tabs['confirmation'].addSprite( shopid + "-tabs-confirmation-no", { 
			animation: this.exitAnimation,
			width: EXIT_WIDTH,
			height: EXIT_HEIGHT,
			'posx' : shopwidth - EXIT_WIDTH , //shopwidth - EXIT_WIDTH ,
			'posy' : shopheight - EXIT_HEIGHT - 5
		} );
		this.tabs['confirmation'].addSprite( shopid + "-tabs-confirmation-text", { 
			width: shopwidth - 2 * EXIT_WIDTH,
			height: 0.25 * shopheight,
			posx: 0.5 * shopwidth,
			posy: 10
		} );
		$( "#" + shopid + "-tabs-confirmation-text" ).append( "<h2>Confirm Purchase...</h2>" );
		$( "#" + shopid + "-tabs-confirmation-yes" ).mouseover( function(){
			tooltip.show( "Confirm purchase" );
		} );
		$( "#" + shopid + "-tabs-confirmation-yes" ).mouseleave( function(){ 
			tooltip.hide();
		} );
		$( "#" + shopid + "-tabs-confirmation-no" ).mouseover( function(){
			tooltip.show( "Cancel purchase" );
		} );
		$( "#" + shopid + "-tabs-confirmation-no" ).mouseleave( function(){ 
			tooltip.hide();
		} );
		
		
		// Setting up the payment tabs
		this.tabs['payment'] = this.container.addGroup( shopid + "-tabs-payment", { 
			width: shopwidth,
			height: shopheight
		} );
		
		this.tabs['payment'].addSprite( shopid + "-tabs-payment-form", { 
			width: shopwidth,
			height: shopheight,
			posx: 5,
			posy: 5
		} );
		
		
		this.tabs['payment'].addSprite( shopid + "-tabs-payment-submit", { 
			animation: this.approveAnimation,
			width: EXIT_WIDTH,
			height: EXIT_HEIGHT,
			posx: shopwidth - 2 * EXIT_WIDTH,
			posy: shopheight - EXIT_HEIGHT - 5
		} )
		this.tabs['payment'].addSprite( shopid + "-tabs-payment-cancel", { 
			animation: this.exitAnimation,
			width: EXIT_WIDTH,
			height: EXIT_HEIGHT,
			posx: shopwidth - EXIT_WIDTH,
			posy: shopheight - EXIT_HEIGHT - 5
		} );
		
		/*
		this.tabs['payment'].addSprite( shopid + "-tabs-payment-submit", { 
			animation: this.approveAnimation,
			width: EXIT_WIDTH,
			height: EXIT_HEIGHT,
			posx: shopwidth / 2,
			posy: shopheight - EXIT_HEIGHT - 5
		} );
		this.tabs['payment'].addSprite( shopid + "-tabs-payment-cancel", { 
			animation: this.exitAnimation,
			width: EXIT_WIDTH,
			height: EXIT_HEIGHT,
			posx: shopwidth - EXIT_WIDTH,
			posy: EXIT_HEIGHT
		} );
		*/
		
		$( "#" + shopid + "-tabs-payment-submit" ).mouseover( function(){ 
			tooltip.show( "Submit payment" );
		} );
		$( "#" + shopid + "-tabs-payment-submit" ).mouseleave( function(){
			tooltip.hide();
		} );
		$( "#" + shopid + "-tabs-payment-submit" ).click( function(){ 
			var data = GetPaymentForm();
			BuyItem( data );	
		} );
		$( "#" + shopid + "-tabs-payment-cancel" ).mouseover( function(){ 
			tooltip.show( "Cancel" );
		} );
		$( "#" + shopid + "-tabs-payment-cancel" ).mouseleave( function(){
			tooltip.hide();
		} );
		$( "#" + shopid + "-tabs-payment-cancel" ).click( (function(sh){ 
			return function(){
				sh.mall.show(); 
				sh.tabs['payment'].hide(500); 
			};
		} )(this) );
		
		
		// Temporarily hiding the stuff I don't need
		this.tabs['confirmation'].hide();
		this.tabs['payment'].hide();
		
		// Setting up the sprites for the 10 items
		this.items = []; this.itemtiles = [];
		for( var k = 0; k < ITEMS_PER_SHOP; k++ ){
			var itemdata = { 
				'width': ITEM_TILE_WIDTH,
				'height': ITEM_TILE_HEIGHT,
				'posx': ( k % 5 ) * ITEM_TILE_WIDTH + 5,
				'posy' : ( k >= 5 ) * ITEM_TILE_HEIGHT + 5 ,
			};
			var itemtiledata = { 
				'animation': this.itemtileAnimation,
				'width': ITEM_TILE_WIDTH,
				'height': ITEM_TILE_HEIGHT,
				'posx': ( k % 5 ) * ITEM_TILE_WIDTH + 5,
				'posy' : ( k >= 5 ) * ITEM_TILE_HEIGHT + 5 ,
			};
			this.mall.addSprite( shopid + "-item" + k, itemdata );
			this.mall.addSprite( shopid + "-itemtile" + k, itemtiledata );
			this.items.push( $("#" + shopid + "-item" + k ) );
			this.itemtiles.push( $("#" + shopid + "-itemtile" + k ) );
			this.itemtiles[k].css( "z-index", 507 );
			this.items[k].css( "z-index", 508 );
		}
	
		// registering a callback to close the shop 
		// in case you're reading this and getting cancer, here is what is going on
		// I declare an anonymouse function of 1 variable
		// which returns a function closing the dom element passed in
		this.exit.click( (function(faggot){
			return function(){ faggot.destroy(); };
		})(this) );
		this.exit.mouseover( function(){
			tooltip.show( "Close the shop" );
		} );
		this.exit.mouseleave( function(){ 
			tooltip.hide();
		} );
		
		// We have to put this container shit somewhere
		this.container.css( "left", shopx );
		this.container.css( "top", shopy );
		this.container.css( "background-color", SHOP_BGCOLOR );
		this.container.css( "z-index", 500 );
		//this.container.hide();
		
		// Setting the flag
		this.initializationFlag = true;
		
	}
	
	this.LoadShop = function( items ){ 
		this.itemAnimations = [];
		for( var k = 0; k < items.length; k++ )
		this.itemAnimations.push( new $.gameQuery.Animation({ 
			imageURL: items[k]['tileset']
		}));
		
	}
	
	// The only function that the outside world should call
	this.SetupShop = function( items, gamedata ){ 
		// Step 0: doing setup
		if( items == undefined )
			return;
		if( this.initializeFlag )
			this.destroy();
		this.initialize(gamedata);
		this.LoadShop( items );
		$.playground().startGame();
		
		// Step 1: Loading the items
		var itemCount = items.length > 10 ? 10 : items.length;
		// A tab holds 10 items. Eventually, we want more tabs, for now, we have only 1
		var k, j;
		
		for( k = 0; k < itemCount; k++ ){
			this.items[k].setAnimation( this.itemAnimations[k] );
			
			// Registering reactionary events
			this.items[k].mouseover( GetMouseOverCallback( items[k] ) );
			this.items[k].mouseleave( function(){ 
				tooltip.hide();
			} );
			this.items[k].click( GetBuyCallback( items[k], this ) );
		}
		
		for( j = 0; k + j < 10; j++ ){ 
			this.items[k+j].setAnimation( this.lockedAnimation );
			this.items[k+j].mouseover( function(){ 
				tooltip.show( "Item locked" );
			} );
			this.items[k+j].mouseleave( function(){ 
				tooltip.hide();
			} );
		}
		
		myShop = this;	
	}
	
	this.CloseShop = function(){ 
		this.destroy();
	}
	
	this.destroy = function(){ 
		// Step 1: Remove all the elements
		this.container.hide(1000);
		this.container.remove();
		
		// Step 2: Null all the dom elements
		this.container = undefined;
		this.mall = undefined;
		this.items = undefined;
		this.exit = undefined;
		this.tabs = undefined;
		tooltip.hide();
		
		// Step 3: deleting the animations
		delete this.itemAnimations;
		delete this.lockedAnimation;
		delete this.vacantAnimation;
		delete this.exitAnimation;
		delete this.approveAnimation;
		
		// Step 4: Setting the flag
		this.initializationFlag = false;
	}
	
	this.SetupConfirmation = function( item ){ 
		this.mall.hide();
		this.tabs['confirmation'].css( "z-index", 501);
		this.tabs['confirmation'].show(1000);
		
		$( "#" + SHOP_ID + "-tabs-confirmation-yes" ).click( (function(it, sh){ 
			return function(){ sh.SetupPayment(it); };
		})(item, this) );
		
		$( "#" + SHOP_ID + "-tabs-confirmation-no" ).click( (function(sh){
			return function(){ 
				sh.tabs['confirmation'].hide(500); 
				sh.mall.show(1000); 
			};
		})(this) );
	}
	
	this.SetupPayment = function( item ){ 
		this.tabs['confirmation'].hide();
		this.tabs['payment'].css( "z-index", 501 );
		this.tabs['payment'].show(550);
		var formdata = GeneratePaymentForm(item);
		$("#" + SHOP_ID + "-tabs-payment-form").html(formdata);
	}
	
	this.CompletePurchase = function( result ){ 
		this.tabs['payment'].hide();
		this.mall.show( 500 );
		this.flash.append( "<h2>" + result + "</h2>" );
		this.flash.show( 250, (function(el){ return function(){ el.hide(2000) }; })(this.flash));
		
	}
}

function GeneratePaymentForm(item){
	var ftag = SHOP_ID + "-payment-form";
	var output = "<h1>Payment Information</h1>";
	output += JSForm.build( { 
		itemId: { 
			tag: "input",
			type: "hidden",
			value: item['id']
		} ,
		name: { 
			tag: 'input',
			type: 'text',
			placeholder: 'Jack Jackson'
		},
		phone:{ 
			tag: 'input',
			type: 'text',
			placeholder: '323 555 5555'
		},
		email: { 
			tag: "input",
			type: "text",
			placeholder: "example@email.com"
		}
	}, ftag );
	return output;
}

function GetPaymentForm(){ 
	return JSForm.get();
}

function GetMouseOverCallback( item ){ 
	return function(){ 
		tooltip.show( "<p>Description: " + item['description'] + "</p><p>Price: $" + item['price'] + "</p>" );
	};
}

function GetBuyCallback( item, theShop ){ 
	return function(){ 
		theShop.SetupConfirmation( item );
	};
}
/*******************************
* Run-use code                                  *
*******************************/
var myshop = new IndigioShop();
function BuyItem( data ){ 
	// TODO: write me!
}
	

