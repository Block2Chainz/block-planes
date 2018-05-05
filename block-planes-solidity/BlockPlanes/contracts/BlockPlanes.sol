pragma solidity ^0.4.19;

import "./helpers/ownable.sol";
import "./helpers/safemath.sol";

/// @title BlockPlanes main contract
/// @author Sean Malone, Joseph Nguyen, Nick Vrdoljak

contract BlockPlanes is Ownable {

    using SafeMath for uint256;

    event NewPlane(uint planeId, uint attributes);

    /// @param length of attr string is limited
    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    /// @param cost of purchasing a new random plane
    uint newPlaneFee = 0.001 ether;

    struct Plane {
        uint attributes;
    }

    /// @param array of all planes
    Plane[] public planes;

    /// @param each plane has one owner
    mapping (uint => address) public planeToOwner;
    /// @param keep track of how many plans an owner has
    mapping (address => uint) ownerPlaneCount;

    /// @param take in an attribute string, create a plane, and push it to the planes array with the owner who paid for it
    function _createPlane(uint _attributes) internal {
        uint id = planes.push(Plane(_attributes)) - 1;
        planeToOwner[id] = msg.sender;
        ownerPlaneCount[msg.sender]++;
        emit NewPlane(id, _attributes);
    }

    /// @param generate a random attribute string based on the owner address and a timestamp
    /// @dev using now is not secure way of generating random number. due to the low security concerns of creating random planes, this is acceptable
    function _generateRandomAttributes() private view returns (uint) {
        uint rand = uint(keccak256(msg.sender, now));
        return rand % dnaModulus;
    }

    /// @param public facing function to create random plane - costs ether
    function createRandomPlane() external payable {
        require(msg.value == newPlaneFee);
        uint randDna = _generateRandomAttributes();
        randDna = randDna - randDna % 100;
        _createPlane(randDna);
    }

    /// @param a method to reset the plane price by owner
    function setLevelUpFee(uint _fee) external onlyOwner {
        newPlaneFee = _fee;
    }

    /// @param take in the owner address and return an array of all of their plane ids
    function getZombiesByOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](ownerPlaneCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < planes.length; i++) {
            if (planeToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /// @param withdraw funds to the owner's account
    function withdraw() external onlyOwner {
        owner.transfer(this.balance);
    }

}
