/************************
* Assistance functions      *
**************************/
function TileEqual( t1, t2, t3){ 
	if( t2 == undefined )
		return false;
	if( t3 == undefined )
		return t1.sval() == t2.sval();
	return t1.sval() == t2.sval() && t1.sval() == t3.sval() ;
}

function TileFlush( t1, t2, t3){ 
	if( t1 == undefined || t1.suit == 3)
		return false;
	if( t2 == undefined || t2.suit == 3 )
		return false;
	if( t3 == undefined || t3.suit == 3 )
		return false;
	
	var result = 	t1.sval() + 1 == t2.sval() && t2.sval() + 1 == t3.sval();
	return result;
}

