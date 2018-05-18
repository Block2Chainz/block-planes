pragma solidity ^0.4.19;

import "./helpers/ownable.sol";
import "./helpers/safemath.sol";

/// @title BlockPlanes main contract
/// @author Sean Malone, Joseph Nguyen, Nick Vrdoljak

contract BlockPlanes is Ownable {

    /// throws errors when overflow is going to occurr
    using SafeMath for uint256;

    /// emits an event when a plane is created
    event NewPlane(uint planeId, uint attributes);

    /// limits the length of the attribute string
    uint attrDigits = 16;
    uint attrModulus = 10 ** attrDigits;

    /// sets a fee for purchasing a new plane
    uint newPlaneFee = 0.001 ether;

    struct Plane {
        uint attributes;
        bool sell;
    }

    /// store all planes in an array
    Plane[] public planes;

    /// map each plane to a single owner
    mapping (uint => address) public planeToOwner;
    /// map each owner to a number of planes
    mapping (address => uint) public ownerPlaneCount;

    /// takes in an attribute string and adds a plane struct to the planes array, then emits a new plane event
    function _createPlane(uint _attributes) internal {
        uint id = planes.push(Plane(_attributes,false)) - 1;
        planeToOwner[id] = msg.sender;
        ownerPlaneCount[msg.sender] = ownerPlaneCount[msg.sender].add(1);
        emit NewPlane(id, _attributes);
    }

    /// generates a random plane attribute string based on the sender's address and the current block/time
    /// @dev now is not secure for RNG but this is a non-critical function so it is deemed acceptable
    function _generateRandomAttributes() private view returns (uint) {
        uint rand = uint(keccak256(msg.sender, now));
        return rand % attrModulus;
    }

    /// payable function for user to create a plane
    function createRandomPlane() external payable {
        require(msg.value == newPlaneFee);
        uint randDna = _generateRandomAttributes();
        randDna = randDna - randDna % 100;
        _createPlane(randDna);
    }

    /// methodology to re-set the purchase fee 
    function setPurchaseFee(uint _fee) external onlyOwner {
        newPlaneFee = _fee;
    }

    /// takes owner address and iterates over all planes, returning an array of the plane IDs that they own 
    /// (to get the planes themselves you will need to iterate through and get the planes themselves via the mapping getter function)
    function getPlanesByOwner(address _owner) external view returns(uint[]) {
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

    // /// withdraw funds to the owner's account
    // function withdraw() external onlyOwner {
    //     owner.transfer(this.balance);
    // }
}