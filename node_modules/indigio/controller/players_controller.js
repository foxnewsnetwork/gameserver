/************************
* Players Controller           *
************************/
// This controller manages things like signin and stuff
// Normally in ruby rails, this would all be a part of the model
var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost/');
    mongoose.load('./models/');      
    IngidioPlayer = mongoose.get('IngidioPlayer',db); // collection name

this.SignIn = function( login, password ) { 
	// TODO: write this function
	
	// Step 1: login is either the username or the email
	// Confirm that it is even in the database or not
	
	// Step 2: Use md5 to hash the password for a match
	
	// Step 3: return the IngidioPlayer object if login is correct
	// Return false otherwise
}

this.SignUp = function( email, password, username ){ 
	// TODO: write this function
	
	// Step 1: check if the email is already taken
	
	// Step 1.5: use md5 to work out the password hash and salt
	var hash;
	var salt;
	
	// Step 2: create it!
	var player = new IngidioPlayer({ 
		'email': email, 
		'username': username, 
		'password': hash,
		'salt': salt  
	});
	
	// Step 3: Fill in the date of creation and stuff
	
	// Step 4: save it
	if( player.save() )
		return player;
	else
		return false;
}


