var BlockPlanes = artifacts.require("../contracts/planeownership.sol");

contract('BlockPlanes', function(accounts) {
    var planesInstance;

    it('initializes with the owner in the store', function() {
        return BlockPlanes.deployed().then(function(i) {
            return i.owner();
        }).then(function(owner) {
            assert.equal(owner, web3.eth.accounts[0], `owner should be the deployer`);
        });
    });

    it('allows a user to purchase a random plane', function() {
        return BlockPlanes.deployed().then(function(i) {
            planesInstance = i;
            return planesInstance;
        }).then(function(contract) {
            return contract.createRandomPlane({ from: accounts[0], value: web3.toWei(0.001, 'ether')});
        }).then(function(receipt) {
            let planeId = receipt.logs[0].args.planeId.toNumber();
            assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'NewPlane', 'the event type is correct');
            assert.equal(planeId, 0, 'the plane should have an id');
            return planeId;
        }).then(function(plane) {
            return planesInstance.planeToOwner(plane);
        }).then(function(owner) {
            assert.equal(owner, accounts[0], 'the plane\'s owner should be the one who called the function');
            return planesInstance;
        }).then(function(contract) {
            return contract.createRandomPlane({from: accounts[0], value: web3.toWei(0.0001, 'ether')});
        }).then(assert.fail).catch(function(err) {
            assert(err.message.indexOf('revert') >= 0, 'should throw and error if insufficient funds are provided');
        });
    });

    it('allows all of a user\'s planes to be retrieved', function() {
        return BlockPlanes.deployed().then(function(i) {
            planesInstance = i;
            return planesInstance;
        }).then(function(contract) {
            return contract.getPlanesByOwner(accounts[0]);
        }).then(function(planes) {
            assert.equal(typeof planes, 'object', 'should return an array of the user\'s planes');
            assert.equal(planes.length, 1, 'the array should have length of 1');
        });
    });

    // it('successfully transfer ownership from buyer to seller', function() {
    //   return BlockPlanes.deployed().then(function(i) {
    //     planesInstance = i;
    //     return planesInstance;
    //   }).then(function(contract) {
    //     return contract.getPlanesByOwner(accounts[0]);
    //   }).then(function(planes) {
    //     assert.equal(typeof planes, 'object', 'should return an array of the user\'s planes');
    //     assert.equal(planes.length, 1, 'the array should have length of 1');
    //   });
    // });
    
});