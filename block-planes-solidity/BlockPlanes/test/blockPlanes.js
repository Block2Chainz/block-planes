var BlockPlanes = artifacts.require("../contracts/BlockPlanes.sol");

contract('BlockPlanes', function(accounts) {
    var planesInstance;

    it('initializes with the owner in the store', function() {
        return BlockPlanes.deployed().then(function(i) {
            return i.owner();
        }).then(function(owner) {
            assert.equal(owner, 0x68cf2F7CD18920a0FC73Eb87CE0E2eB396Ff2a0d, `owner should be the deployer`);
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

    // it('throws an exception for invalid candidates', function () {
    //     return Election.deployed().then(function (i) {
    //         electionInstance = i;
    //         return electionInstance.vote(99, { from: accounts[1] })
    //     }).then(assert.fail).catch(function (err) {
    //         assert(err.message.indexOf('revert') >= 0, "error message must contain revert");
    //         return electionInstance.candidates(1);
    //     }).then(function (candidate1) {
    //         var voteCount = candidate1[2];
    //         assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
    //         return electionInstance.candidates(2);
    //     }).then(function (candidate2) {
    //         var voteCount = candidate2[2];
    //         assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    //     });
    // });

    // it('throws an exception for double voting', function () {
    //     return Election.deployed().then(function (i) {
    //         electionInstance = i;
    //         candidateId = 2;
    //         electionInstance.vote(candidateId, { from: accounts[1] });
    //         return electionInstance.candidates(candidateId);
    //     }).then(function (candidate) {
    //         var voteCount = candidate[2];
    //         assert.equal(voteCount, 1, 'accepts first vote');
    //         return electionInstance.vote(candidateId, { from: accounts[1] });
    //     }).then(assert.fail).catch(function (err) {
    //         assert(err.message.indexOf('revert') >= 0, 'error message must contain revert');
    //         return electionInstance.candidates(1);
    //     }).then(function (candidate1) {
    //         assert.equal(candidate1[2], 1, 'candidate1 vote count did not change');
    //         return electionInstance.candidates(2);
    //     }).then(function (candidate2) {
    //         assert.equal(candidate2[2], 1, 'candidate2 vote count did not change');
    //     });
    // });
});