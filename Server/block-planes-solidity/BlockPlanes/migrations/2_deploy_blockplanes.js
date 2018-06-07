var PlaneOwnership = artifacts.require("../contracts/PlaneOwnership.sol");

module.exports = function(deployer) {
  deployer.deploy(PlaneOwnership);
};
