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
	InGidioItems = NormalShop.Stock(items)
	for( var k = 0;  k < InGidioItems.length; k++ ){ 
		InGidioItems[k].Size(70,70);
		InGidioItems[k].Hide();
	} // end for
} );
