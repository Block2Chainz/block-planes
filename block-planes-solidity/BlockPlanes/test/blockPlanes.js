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

    
});