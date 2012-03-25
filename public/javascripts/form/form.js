/***********************************
* InGidio Javascript Form Generator *
************************************/
// Needs gayQuery to work
var FORM_PREFIX = "jf094uj954gj95gng3yugny598gyn1o3u3hrg";
/*
specs = [
	{ 
		tag : "input" , <- required!
		id : "faggot01" , <- required (if you want to get data from it)
		content : "stuff goes in here" <- for stuff that aren't attributes
		 ...
	} ,	
	...
]
*/
var InGidioForm = function(){ 
	var formids = {};
	return{ 
		build : function( specs ){ 
			formids = {};
			var output = "<ul id='" + FORM_PREFIX + "-form' style='list-style: none; display: inline;'>";
			for( var k = 0; k < specs.length; k++ ){ 
				var spec = specs[k];
				output += "<li id='"+ FORM_PREFIX + k + "'>";
				output += "<" + spec['tag'] + " ";
				for( var j in spec ){ 
					if( j == 'tag' || j == 'content' ){ 
						continue;
					}
					if( j == 'id' ){ 
						output += j + "='" + FORM_PREFIX + spec[j] + "' ";
						formids[spec[j]] = ( FORM_PREFIX + spec[j] );
						continue;
					}
					output += j + "='" + spec[j] + "' ";
				} // end foreach loop
				output += ">";
				if( spec['content'] != undefined ){ 
					output += spec['content'];
				}
				output += "</" + spec['tag'] + ">";
			} // end for loop
			return output;
		} , // end build function
		get : function( ){ 
			var output = {};
			for( var k in formids ){ 
				output[k] = $("#" + formids[k]).val();
			}
			return output;
		} ,
	};
}();
