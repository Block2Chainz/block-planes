var BlockPlanes = artifacts.require("../contracts/BlockPlanes.sol");

module.exports = function(deployer) {
  deployer.deploy(BlockPlanes);
};
