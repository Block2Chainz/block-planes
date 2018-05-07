var BlockPlanes = artifacts.require("../contracts/blockplanes.sol");

module.exports = function(deployer) {
  deployer.deploy(BlockPlanes);
};
