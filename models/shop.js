/****************************
* Node Package Declarations *
*****************************/
var http = require( "http" );

// querystring for post formatting
var querystring = require("querystring");

/****************************
* Constant Configurations        *
*****************************/
var SHOP_SITE = "gamertisers.com" ,
	SHOP_PATH = "/api/v1/products.json" ,
	SHOP_PORT = 80,
	GAME_TOKEN = 12345 ;
	
/****************************
* Class Declarations                   *
*****************************/
var ServerShop = function(){ 
	this.items;
	this.url;
	this.ip;
	
	/*
	dataspec = { 
		url : the url of the site you want to callshop on
		ip : the ip of the user calling the shop
		callback : a function you wish to have called when the store is ready
	};
	*/
	this.RequestItems = function(data){ 
		var callback;
		if( data != undefined ){ 
			this.url = data['url']; this.ip = data['ip'];  callback = data['callback'];
		}
		
		var querydata = querystring.stringify({ 
			url : this.url,
			ip : this.ip,
			token : GAME_TOKEN
		});
		var options = { 
			host : SHOP_SITE,
			port : SHOP_PORT,
			path : SHOP_PATH + "?" + querydata
		};
		
		// This delegate goes into a thick stack and does work
		var inceptionDelegate = (function(shop){
			return function(items){ shop.items = items; };
		})(this);
		
		var request = http.get( options, function(response){ 
			response.on( "data", function(chunk){ 
				var rawResult = JSON.parse(chunk)['result'];
				var item, items=[];
				for( var k = 0; k < rawResult.length; k++ ){ 
					item = rawResult[k];
					items.push( { 
						'description': item['description'],
						'id': item['id'],
						'company_id': item['company_id'],
						'tileset': item['picture_path_small'],
						'price': item['cost'],
						'title': item['title'],
						'created_at': item['created_at'],
						'updated_at': item['updated_at']
					} ); // end push
				} // end for
				inceptionDelegate( items );
				if( callback != undefined ) 
					callback( items );
			} ); // end response.on
		} ); // end http.get
	} // end this.RequestItems
	
	// Parameter explanations
	/**
		data = { 
			
		}
	*/
	this.BuyItem = function( data ){ 
		
	} // end this.BuyItem
}
var url = req['query']['url'] == undefined ? encodeURIComponent( "http://facebook.com" ) : req['query']['url'];
console.log( req['query'] );
var ip = req.connection.remoteAddress;
console.log( ip );
var rawcode = "$(document).ready(function(){ var items =";
var options = { 
	host: shopSite,
	port: shopPort,

	path: shopPath + gameToken + "&url=" + url + "&ip=" + encodeURIComponent( ip )
};
var request = http.get( options, function(response){ 
	response.on("data", function(chunk){ 
		var lolcat = JSON.parse(chunk)['results'];
		console.log(lolcat);
		var fag, stuff = [];
		for( var k = 0; k < lolcat.length; k++ ){ 
			fag = lolcat[k];
			
			stuff.push( { 
				'description': fag['description'],
				'id': fag['id'],
				'company_id': fag['company_id'],
				'tileset': fag['picture_path_small'],
				'price': fag['cost'],
				'title': fag['title'],
				'created_at': fag['created_at'],
				'updated_at': fag['updated_at']
			} );
			
		}
		rawcode += JSON.stringify(stuff);
		/*
		rawcode += JSON.stringify([{
			'description' : "Faggot",
			'tileset' : "http://i299.photobucket.com/albums/mm281/foxnewsnetwork/csharp.png" ,
			'price': 1000
		}] );
		*/
		rawcode += "; myshop.SetupShop( items ); } );";
		console.log(rawcode);
		res.send( rawcode );
	});
});
