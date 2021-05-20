# Introduction
BlockPlanes is a top-down aerial shooter with unique, randomly-generated, player-owned planes that can be bought, sold, and shown off. The plane attributes are stored in an Ethereum smart contract as an ERC-721 token. It is also a full social platform with live-chat, friends, and notifications. Play single player or against your friends. This repo contains over 10,000 lines of code.

## Get Started
You will need the <a href='https://metamask.io'>MetaMask extension</a> installed to access the ethereum-based features of the site. To purchase planes, please connect to the Ropsten test network in Metamask, see screenshot below:

<img size='tiny' src='http://res.cloudinary.com/dkkgoc7cc/image/upload/v1527350272/Screenshot_1.png'/>

You can obtain free test ether from a <a href='https://faucet.ropsten.be/'>Ropsten faucet</a>. 

## Visit the Site
www.blockplanes.net

## How to check out the Multiplayer game
You can have a friend sign up and invite you to a game. 

Alternatively you can open an incognito tab, create another player, and invite them to a game. 

And finally, you can always contact me and I will be happy log on and play with you (vrdoljaknicholas@gmail.com).

## How it was built
The BlockPlanes front-end was built using React/Redux/React-Router. 

The game functionality was build on HTML5 Canvas. 

The REST-server was built with Node/Express.

The database was built with MySQL. 

The smart contract was built using Truffle and Ganache, and deployed to the Ropsten Ethereum Test Network.

The multiplayer and notification/chat features were built out using Socket.io. 

## About the Live-Multiplayer
The live multiplayer utilizes Socket.io rooms to place two users together. When a user moves or shoots, it is rendered locally to make sure the user does not experience lag. It simultaneously sends the movement/shooting data to the socket. 

The server is responsible for tracking all objects, spawning new enemies, updating their movement, reconciling player positions, and detecting collisions. 

The socket server tracks all objects in the game, and sends location data to both players. Each enemy has a velocity, direction, health total, and radius. The server renders enemy movement 30 times a second, checks for collisions, and updates both players with an abridged version of each object to save on packet data size. For example, enemies have a velocity attribute, but since the motion calculations are only being conducted on the server, the clients don't need to be aware of this. 

The clients receive the positional data and interpolates it for smooth motion at 60 frames per second. There is inevitable lag in any online multiplayer game, but by using movement interpolation the player experience is mostly preserved. 

Improvements that can be made: 
   - Only send enemy positional data when the enemy is spawned. Include the velocity data so the clients can render enemy movement locally, but also track on the server to detect collisions. This will greatly decrease the packet size that is sent from the server and result in speedier gameplay. 
   - To be continued...
   
## About the Smart Contract
  - The Smart Contract was built using Truffle/Ganache for testing and deployed on the Ropsten Ethereum Test Network
