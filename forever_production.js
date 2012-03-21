// Daemons are for production use
var forever = require( "forever" );

var child = new (forever.Monitor)('app_production.js', {
    max: 3,
    silent: true,
    options: []
});

child.on('exit', function(){ console.log( "We fucked up"); });
child.start();
