pragma solidity ^0.4.19;

import "./helpers/ownable.sol";
import "./helpers/safemath.sol";

/// @title BlockPlanes main contract
/// @author Sean Malone, Joseph Nguyen, Nick Vrdoljak

contract BlockPlanes is Ownable {

    using SafeMath for uint256;

    event NewPlane(uint planeId, uint attributes);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    uint newPlaneFee = 0.001 ether;

    struct Plane {
        uint attributes;
    }

    Plane[] public planes;

    mapping (uint => address) public planeToOwner;
    mapping (address => uint) public ownerPlaneCount;

    function _createPlane(uint _attributes) internal {
        uint id = planes.push(Plane(_attributes)) - 1;
        planeToOwner[id] = msg.sender;
        ownerPlaneCount[msg.sender] = ownerPlaneCount[msg.sender].add(1);
        emit NewPlane(id, _attributes);
    }

    function _generateRandomAttributes() private view returns (uint) {
        uint rand = uint(keccak256(msg.sender, now));
        return rand % dnaModulus;
    }

    function createRandomPlane() external payable {
        require(msg.value == newPlaneFee);
        uint randDna = _generateRandomAttributes();
        randDna = randDna - randDna % 100;
        _createPlane(randDna);
    }

    function setPurchaseFee(uint _fee) external onlyOwner {
        newPlaneFee = _fee;
    }

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

    /// @param withdraw funds to the owner's account
    // function withdraw() external onlyOwner {
    //     owner.transfer(this.balance);
    // }

}
