/*************************
* A / B Test Management   *
**************************/
// This class will handle the good ol' stuff with ab testing
var SplitTest = function(){ 
	// Records the user's ip, starts tracking.
	// returns true if the user is placed in the beta group
	// false otherwise
	this.AddUser = function(ip){ 
		// TODO: implement the function description
		// For now, it just returns true 40% of the time
		var chance = Math.floor(Math.random() * 100);
		if( chance < 40 )
			return true;
		else
			return false;
	} // end AddUser
} // end SplitTest

// Exposed API
this.ABTestManager = new SplitTest();
