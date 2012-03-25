var INGIDIO_SCRIPT_PATH = "http://localhost:3000/";
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
	GetShopItems({	url : document.url }); 
	LoadStyleSheets();
	AddShopFunction( "open shop down", function(items){ 
		// alert( "Stuff has come down" );
		InGidioShop.CallSimpleShop(items);
	} );
} );
	



