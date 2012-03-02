// Extensions to the mibbu framework
function mibbuSetSpritePosition( sprite, x, y, z ){
	sprite.x = x;
	sprite.y = y;
	sprite.z = z;
	sprite.position(x,y,z);
}

function mibbuMoveSpritePosition( sprite, dx, dy, dz){
	mibbuSetSpritePosition(
		sprite,
		sprite.x + dx,
		sprite.y + dy,
		sprite.z + dz
	);
}

