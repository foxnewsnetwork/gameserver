/************************
* Flotile Bridge Class          *
*************************/
// Do some renaming and whatnot to expose
// haXe class to regular javascript which is
// how I plan to make haXe code friendly with
// prior existing javascript code (to prevent 
// crap-tons of reinventing the world)

var NormalShop = function(){ 
	var shop = new main.Shop();
	
	return{ 
		Stock : function(items){ 
			return shop.Stock(items);
		} // end Stock
	}; // end return;
}(); // end NormalShop
