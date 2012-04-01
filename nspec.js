/***********************************
* NodeJS Test Files                                *
***********************************/
// Well, at long last we have moved into doing test-driven development even in the node atmosphere
// Run these tests by doing the good ol' command line order:
// $ node nspec.js
// and read the console output
// Also, not everything is guarenteed to rollback correctly after a test
// So use at your own discretion
// Also, don't run tests in live deployment because tests kill the entire database
//var TEST_MODE = true;

// the Queue be filled with stuff like:
/*
[ test1, test2, etc... ]
*/
// Be sure to write the tests so that they can be run in parallel
// avoiding race conditions is the name of the game
// each test should handle its own callbacks
var TestQ = [];

/***********************************
* Model tests                                              *
***********************************/
// Testing the player model
var playerModel = require( "./models/player.js" );
var Player = playerModel.Player;

TestQ.push( function(){ 
	// Step 1: Setting up
	var players = [];
	for( var k = 0; k < 10; k++ ){ 
		players.push( new Player( { 
			name : "player" + k, 
			email : "faggot" + k + "@fag.com", 
			password : "nigger" + k 
		} ) );
		players[k].save();
	}
	
	// Step 2: Running the tests
	// Test 1: Login Test
	for( var k = 0; k < 10; k++){ 
		var em = players[k].email; 
		var pw = "nigger" + k;
		Player.login( { 
			'email':  em,
			'password': pw
		}, (function(p){
			return function(err, obj){ 
				if( err ){ 
					console.log( "Test failed @ " );
					console.log( err );
					return;
				}
				else{ 
					if( obj.email == p.email ){ 
						console.log( "Test passed" );
					}
					else{ 
						console.log( "Test failed @ wrong match" );
						console.log( obj.email + " and " + p.email );
					}
				}
				CompleteTest();
			};
		})(players[k]) ); 
	}	
} );

var count = 0;
function CompleteTest(){ 
	count++;
	console.log( "Test # " + count + " out of 10" );
	if( count == 10 ){ 
		Player.remove( {} , function(err,doc){ console.log( "Tests Completed" ); } );
	}
}

// Shop tests
var shopModel = require( "./models/shop.js" );
var Shop = shopModel.InGidioShop;

TestQ.push( function(){ 
	// Step 1: Initialize the tests
	var data = { 
		url: "http://www.facebook.com/api/v1/faggot" ,
		ip: "127.0.66.99" ,
		callback: function(items){ 
			if( items == undefined )
				console.log( "Test failed");
			else
				console.log(items) ;
		}
	};
	
	// Step 2: Do the tests
	Shop.RequestItems(data);
	
	// Step 3: Clean up after the tests
} );
/***********************************
* Test Run Code                                       *
***********************************/
// Here is the execution code to actually run the tests
for( var k = 0; k < TestQ.length; k++){ 
	var atest = TestQ[k];
	atest();
}
