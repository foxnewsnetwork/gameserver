Namespaces
=
1. InGidio.shop : shop features
  1. InGidio.shop.mode : mode selection from easy -> normal -> hard
  2. InGidio.shop.tiles : contains the tiles for the items
  3. InGidio.shop.Refresh() : function to refresh tiles
2. InGidio.game : game server features
  1. InGidio.game.JoinGame()
  2. InGidio.game.JoinChat()
  3. InGidio.game.Chat()
  4. InGidio.game.FireEvent()
3. InGidio.admin
4. InGidio.cashier (hidden namespace)
  1. InGidio.cashier.Checkout();
5. InGidio.form (hidden namespace)
  1. InGidio.form.build()
  2. InGidio.form.get()

Case-Specific Deployment Instructions
=
1. Change app.listen(3000) -> app.listen(80) in app.js
2. $ ruby squeeze.rb
3. $ ruby compress.rb
4. $ mv hypedog.js public/javascripts/ -f
5. $ mv browser.js public/javascripts/ -f
6. Change var socket = io.connect( "http://localhost:3000" ) -> var socket = io.connect( "http://crunchymall.com" ) in clientv2.js
7. Change PATH_NAME = http://localhost:3000 -> PATH_NAME = http://crunchymall.com in public/javascript/shop/conf.js 
8. $ cp app.js app_production.js -f
9. $ sudo su
10. $ kill -9 $( lsof -i :80 -t)
11. Repeat step 10 until everyone on port 80 is dead
12. $ node forever_production.js &

Concerns
=
1. Get a list of products that people will purchase
2. Get some good flushed out buzz words
3. Tightened up pitch
4. Get down what we want to do
5. Full walk-through demo

Random Adivce
=
1. Build a personal code-generation framework in either c# or java

Status
=
Unstable; Check back next week!kasjldfkj

Game Server for General Multiplayer Games
===
The idea of the game engine is that it is general enough
to handle all multiplayer games. We also include the framework
necessary to 

The game server is authoritative and does a couple of things

1.	manage rooms
2. stores authoritative game states
3. central repo for events fired by clients
4. stores generic user sign-in information
5. manages user-side shopping

Things to note
=== 
1. Communication must all be done in json
2. Database backend handled by mongodb
3. webserver technology handled by express

How to get up to speed to be able to use this
==
1. install nodejs
2. install npm (node package manager)
3. install mongodb
4. sudo npm install express mongoose jade less expresso hiredis redis socket.io
5. install redis
6. install tcl
 
Alireza Notes
==
1. Letter of incorporation
2. Cap table
3. team bio
4. latest presentation
5. executive summary
6. lawyer info
7. stock purchase agreement
8. simpler payment
9. crowdsource products
10. alii .tv

Netscape notes
==
1. Find someone who is already using my software choice for what I'm doing
2. Check activity for platform
3. Get diseases that everyone gets

Voyager Notes
==
1. Demographics v. Geographic
2. Narrow v. Wide (how to travel the graph)
	|                       |
	|		xB			|			xxB
	|						|
	|						|
D |________|__________
	|						|
	|						|	     0x 
	|						|
	|						|
	|________|__________
               Geo
               
Alireza Meeting notes
==
1. Road map (advisor open positions and people we need to hire)
2. executive summary
3. 3 min pitch deck
4. Logo
5. My pictures
6. Testimonial
7. ONe liner about the company
8. Form for expo + attachments
9. SPA

Nathan Gold Notes
=
1. SSame weak op
2. too much info
3. weak ed (colombo clause)
