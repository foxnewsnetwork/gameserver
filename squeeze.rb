# This ruby file squeezes a bunch of javascript files into 1 javascript file
files = [
	'./public/javascripts/jquery/jquery.js' ,
	'./public/javascripts/gameQuery/gameQuery.js' ,
	'./public/javascripts/alice/alice.js' ,
	'./public/javascripts/alice/alice.core.js' ,
	'./public/javascripts/alice/alice.plugins.cheshire.js' ,
	'./node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js',
	'./public/javascripts/clientv2.js' ,
	'./public/javascripts/form/form.js' ,
	'./public/javascripts/shop/conf.js' ,
	'./public/javascripts/shop/tooltip.js' ,
	'./public/javascripts/shop/generator.js' ,
	'./public/javascripts/shop/shop.js' ,
	'./public/javascripts/shop/browser-drive.js' ,
]

output = File.open( "browser.js", "a+" )
files.each do |filename|
	file = File.open( filename, "r" )
	file.each do |line|
		output.puts( line )
	end
	puts file.size.to_s + " added! \n"
end

puts "Total size: " + output.size.to_s
