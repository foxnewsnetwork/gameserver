/*********************************
* Indigio JS Generated Form Class *
*********************************/
// Class handles form creation and whatnot
/*
specs = { 
	'id1': { 
		'tag': 'input',
		'class': 'faggot'
		...
	},
	'id2': { 
		...
	}
}
*/
var JSForm = function(){ 
	var formIds = {};
	var formprefix = "jfw39ug3j9j";
	
	return { 
		build: function(specs, prefix){ 
			formIds = {};
			if( prefix != undefined )
				formprefix = prefix;
			var output = "";
			for(  var key in specs ){ 
				output += "<" + specs[key]['tag'];
				output += " id='" + formprefix + key + "'";
				formIds[key] = formprefix + key;
				for( var k in specs[key] ){ 
					if( k == "tag" )
						continue;
					output += " " + k + "='" + specs[key][k] + "'"; 
				}
				output += " ></" + specs[key]['tag'] + ">";
			}
			return output;
		},
		get: function(){ 
			var output = {};
			for( var key in formIds ){ 
				output[key] = $( "#" + formIds[key] ).val();
			}
			return output;
		}
	};
}();
