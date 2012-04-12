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
		InGidioItems[k].Hide((function(item){
			return function(){ 
				SendAnalytics(JSON.stringify(item.ClearStats()));
			}; //end return
		})(InGidioItems[k])); // end Hide
		InGidioItems[k].Buy( (function(item){
			return function(pay){ 
				var checkout = { payment : pay , item : item};
				BuyItem(checkout);
			} // end return
		})(InGidioItems[k].Item())); //end Buy
	} // end for
} ); // end AddShopFunction
