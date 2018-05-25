# Introduction
BlockPlanes is a top-down aerial shooter with unique, randomly-generated, player-owned planes that can be bought, sold, and shown off. The plane attributes will be stored in an Ethereum smart contract as an ERC-721 token. It is also a full social platform with live-chat, friends, and notifications. Play single player, against your friends, or against a random opponent. 

*** Note: this is still a work in progress and full functionality has not been completed *** 

## Get Started
You will need Truffle installed, along with Ganache. 

### Install 
In the root directory:
```bash
npm install
```
In the client directory: 
```bash
npm install
```

### Setup Environment
In the solidity folder, migrate the contract, and purchase a random plane (you need ganache running): 
```bash
truffle console
migrate
BlockPlanes.deployed().then(function(i) {inst = i})
inst.createRandomPlane({from: web3.eth.accounts[0], value: web3.toWei(0.001, 'ether')})
```
Seed your mySQL db with the schema.db file in the server folder.

### Start the app
From the client folder: 
```bash
npm run build
```
From the root directory: 
```bash
npm run start
npm run chatSocket
npm run gameSocket
```
