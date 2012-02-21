/****************************
* The player model                      *
****************************/
// The player model interacts with mongodb (or redis) to store
// basic player data. Players must signin with an username / email
// and must then provide his or her password (standard stuff)

var mongoose = require("mongoose"),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    DocumentObjectId = mongoose.Types.ObjectId;

var IngidioPlayer = new Schema({
	_id: { type: String },
	created_at: { type: Number },
	updated_at: { type: Number },
	username: { type: String },
	email: { type: String },
	password: { type: String },
	salt: { type: String }
});

mongoose.model( "IngidioPlayer", IngidioPlayer );


