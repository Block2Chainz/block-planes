var BlockPlanes = artifacts.require("../contracts/BlockPlanes.sol");

contract("BlockPlanes", function (accounts) {
    var planesInstance;

    it('initializes with the owner in the store', function () {
        return BlockPlanes.deployed().then(function (i) {
            return i.owner();
        }).then(function (owner) {
            assert.equal(owner, 0x68cf2F7CD18920a0FC73Eb87CE0E2eB396Ff2a0d, `owner should be the deployer`);
        });
    });

    // it('initialized with the correct values', function () {
    //     return Election.deployed().then(function (i) {
    //         electionInstance = i;
    //         return electionInstance.candidates(1);
    //     }).then(function (c) {
    //         assert.equal(c[0], 1, 'contains the correct id');
    //         assert.equal(c[1], 'Candidate 1', 'contains the correct name');
    //         assert.equal(c[2], 0, 'contains the correct vote count');
    //         return electionInstance.candidates(2);
    //     }).then(function (c) {
    //         assert.equal(c[0], 2, 'contains the correct id');
    //         assert.equal(c[1], 'Candidate 2', 'contains the correct name');
    //         assert.equal(c[2], 0, 'contains the correct vote count');
    //     });
    // });

    // it("allows a voter to cast a vote", function () {
    //     return Election.deployed().then(function (i) {
    //         electionInstance = i;
    //         candidateId = 1;
    //         return electionInstance.vote(candidateId, { from: accounts[0] });
    //     }).then(function (receipt) {
    //         assert.equal(receipt.logs.length, 1, 'an event was triggered');
    //         assert.equal(receipt.logs[0].event, 'votedEvent', 'the event type is correct');
    //         assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, 'the candidateId is correct');
    //         return electionInstance.voters(accounts[0]);
    //     }).then(function (voted) {
    //         assert(voted, "the voter was marked as voted");
    //         return electionInstance.candidates(candidateId);
    //     }).then(function (candidate) {
    //         var voteCount = candidate[2];
    //         assert.equal(voteCount, 1, "the candidate has a vote;")
    //     });
    // });

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