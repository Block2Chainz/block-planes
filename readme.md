# Introduction
BlockPlanes is a top-down aerial shooter with unique, randomly-generated, player-owned planes that can be bought, sold, and shown off. The plane attributes are stored in an Ethereum smart contract as an ERC-721 token. It is also a full social platform with live-chat, friends, and notifications. Play single player or against your friends. 

## Get Started
You will need the <a href='https://metamask.io'>MetaMask extension</a> installed to access the site. To purchase planes, please connect to the Ropsten test network in Metamask, see screenshot below:

<img size='tiny' src='http://res.cloudinary.com/dkkgoc7cc/image/upload/v1527350272/Screenshot_1.png'/>

You can obtain free test ether from a <a href='http://faucet.ropsten.be:3001'>Ropsten faucet</a>. 

## Visit the Site
www.blockplanes.net

## Why is MetaMask required to Log In?
A similar site (Cryptokitties) does not require the user to log in with an account other than their crypto-wallet. Therefore, a user can have as many wallets as they like, and can see their different kitties with each one separately. However, the other features of BlockPlanes, namely live-chat, friends, and leaderboards, require the use of a log-in feature independent of the Blockchain account so that users can interact with each other. 

This necessitated a design decision with some tradeoffs: 

1. We allow users to log in and use the social media features without MetaMask, but in order to view, trade, and play with your planes, you must be logged in with MetaMask.

-Pros: 

   - Users can check out the site without having to install additional software.
  
-Cons: 

   - If a user has multiple wallet addresses that they have used to purchase planes, we either will have to store each account to be able to retrieve all of their planes, or they will not be able to see or use all of their planes at the same time. This either increases our database schema complexity, or harms the user experience due to the inconsistency in the user's hangar.
   - If a user is not logged into their wallet account, they will not be able to use the main feature of our site anyway, since it relies on you having planes in your Hangar so you can play with them.
   - Because you are able to view your friend's hangar regardless of them being logged in, we would have to store each MetaMask account for a user to the db, increasing the complexity of our database as well as the queries. 
    
2. We require users to have a MetaMask account and be logged in, associating a specific account with a specific user. 

-Pros:

   - The user experience is much more streamlined, since after logging into the site all features are available to you.
   - Decreases the complexity of our database schema, since only one field is required for the user's blockchain address, no join tables required. 
   - Keeps the user's hangar consistent. 
    
-Cons:

   - The user must install a chrome/firefox extension to check out our site.
    
    
Due to the above pros and cons, we decided to go with number 2. It increases the initial complexity for the user, but decreases overall inconsistencies. Furthermore, in a real-use scenario, someone who is actually interested in a blockchain enabled game will already have MetaMask installed or will be well aware of how it works.

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
