/***************************
* Browser-side Call Code        *
***************************/
var SCRIPT_PATH = "http://crunchymall.com/";

// Call this code from within the favorites bar in a browser to summon the shop
function LoadStyleSheets(){ 
	var indigiStyle = document.createElement("link");
	indigiStyle.type = "text/css";
	indigiStyle.href = SCRIPT_PATH + "stylesheets/extensions.css";
	indigiStyle.rel = "stylesheet";
	indigiStyle.media = "screen";
	var s = document.getElementsByTagName('body')[0]; 
	s.appendChild(indigiStyle, s); 
};

(function(){ 
	var jQ = document.createElement("script");
	jQ.type = "text/javascript";
	jQ.async = true;
	jQ.src = SCRIPT_PATH + "javascripts/jquery/jquery.js";
	var l = document.getElementsByTagName('script').length;
	var s = document.getElementsByTagName('script')[l-1]; 
	s.parentNode.insertBefore(jQ, s);
	LoadGameQuery();
})();

function LoadGameQuery(){ 
	var gQ = document.createElement("script");
	gQ.type = "text/javascript";
	gQ.async = true;
	gQ.src = SCRIPT_PATH + "javascripts/gameQuery/gameQuery.js";
	var l = document.getElementsByTagName('script').length;
	var s = document.getElementsByTagName('script')[l-1];
	s.parentNode.insertBefore(gQ, s); 
	LoadIndigioShop();
};

function LoadIndigioShop(){ 
	var indigiShop = document.createElement("script");
	indigiShop.type = "text/javascript";
	indigiShop.async = true;
	indigiShop.src = SCRIPT_PATH + "javascripts/shop-debug.js";
	var l = document.getElementsByTagName('script').length;
	var s = document.getElementsByTagName('script')[l-1]; 
	s.parentNode.insertBefore(indigiShop, s); 
	LoadJSForm();
	LoadStyleSheets();
};

function LoadJSForm(){ 
	var jsf = document.createElement( "script" );
	jsf.type = "text/javascript";
	jsf.async = true;
	jsf.src = SCRIPT_PATH + "javascripts/form.js";
	var l = document.getElementsByTagName('script').length;
	var s = document.getElementsByTagName('script')[l-1]; 
	s.parentNode.insertBefore(jsf, s); 
	LoadRunFunction();
};

function LoadRunFunction(){ 
	var uri = document.URL;
	var rf = document.createElement("script");
	rf.type = "text/javascript";
	rf.async = true;
	rf.src = SCRIPT_PATH + "shop?url=" + encodeURIComponent( uri );
	var l = document.getElementsByTagName('script').length;
	var s = document.getElementsByTagName('script')[l-1]; 
	s.parentNode.insertBefore(rf, s); 
}
