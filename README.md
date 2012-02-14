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
4. sudo apt-get install express mongoose jade less expresso

 
