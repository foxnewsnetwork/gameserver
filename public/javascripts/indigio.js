/***************************
* Indigio.js Master Script *
***************************/
// Load this guy get started!

function LoadStyleSheets(){ 
	var indigiStyle = document.createElement("link");
	indigiStyle.type = "text/css";
	indigiStyle.href = "stylesheets/extensions.css";
	indigiStyle.rel = "stylesheet";
	indigiStyle.media = "screen";
	var s = document.getElementsByTagName('body')[0]; 
	s.appendChild(indigiStyle, s); 
};

(function(){ 
	var jQ = document.createElement("script");
	jQ.type = "text/javascript";
	jQ.async = true;
	jQ.src = "javascripts/jquery/jquery.js";
	var l = document.getElementsByTagName('script').length;
	var s = document.getElementsByTagName('script')[l-1]; 
	s.parentNode.insertBefore(jQ, s);
	LoadGameQuery();
})();

function LoadGameQuery(){ 
	var gQ = document.createElement("script");
	gQ.type = "text/javascript";
	gQ.async = true;
	gQ.src = "javascripts/gameQuery/gameQuery.js";
	var l = document.getElementsByTagName('script').length;
	var s = document.getElementsByTagName('script')[l-1];
	s.parentNode.insertBefore(gQ, s); 
	LoadIndigioShop();
};

function LoadIndigioShop(){ 
	var indigiShop = document.createElement("script");
	indigiShop.type = "text/javascript";
	indigiShop.async = true;
	indigiShop.src = "javascripts/shop-debug.js";
	var l = document.getElementsByTagName('script').length;
	var s = document.getElementsByTagName('script')[l-1]; 
	s.parentNode.insertBefore(indigiShop, s); 
	LoadStyleSheets();
};