var INGIDIO_SCRIPT_PATH = PATH_NAME;
function LoadStyleSheets(){ 
	var indigiStyle = document.createElement("link");
	indigiStyle.type = "text/css";
	indigiStyle.href = INGIDIO_SCRIPT_PATH + "stylesheets/extensions.css";
	indigiStyle.rel = "stylesheet";
	indigiStyle.media = "screen";
	var s = document.getElementsByTagName('body')[0]; 
	s.appendChild(indigiStyle, s); 
};

socket.on( "connection", function(id){ 
	// alert( "We are Connected!" );
	GetShopItems({	url : document.URL }); 
	LoadStyleSheets();
	AddShopFunction( "open shop down", function(items){ 
		// alert( "Stuff has come down" );
		InGidioShop.CallSimpleShop(items, { 
			'posx' : window.innerWidth - DEFAULT_SHOP_WIDTH + 5,
			'posy' : window.innerHeight - DEFAULT_SHOP_HEIGHT + 5 
		} );
	} );
} );
	



