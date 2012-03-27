/*******************************
* game-drive file; nothing here yet *
********************************/

var InGidioItems;
socket.on( "connection", function(id){ 
	sessionId = id;
	RefreshItems();
} );

function RefreshItems(){ 
	var meta = { 
		'url' : "http://www.facebook.com/" 
	};
	GetShopItems(meta);
};// end refresh real life items

AddShopFunction("open shop down", function(items){ 
	// tooltip.hide();
	InGidioItems = InGidioShop.CallNormalShop(items, { 
		tile : { 
			width : 70 ,
			height : 70
		} ,
	} );
	for( var k in InGidioItems ){ 
		for( var j = 0; j < InGidioItems[k].length; j++ ){ 
			InGidioItems[k][j].hide();
		}
	}
} );
