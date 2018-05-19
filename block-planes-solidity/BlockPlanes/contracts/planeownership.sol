pragma solidity ^0.4.19;

import "./blockplanes.sol";
import "./helpers/erc721.sol";
import "./helpers/safemath.sol";

/// @title Handler for transferring plane ownership
/// @author Sean Malone, Joseph Nguyen, Nick Vrdoljak

contract PlaneOwnership is BlockPlanes, ERC721 {

    using SafeMath for uint256;

    mapping (uint => address) planeApprovals;
    mapping (uint => bool) planeSellStatus;
    mapping (uint => uint) planeSellPrice;
    mapping (uint => uint) public planeSellCount;

    /// emits an event when a transfer occurs
    event Transfer(address from, address to, uint planeId);

    /// restricts functions to be called only by the owner of the plane;
    modifier onlyOwnerOf(uint _planeId) {
        require(msg.sender == planeToOwner[_planeId]);
        _;
    }

    /// returns the number of planes a user owns
    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerPlaneCount[_owner];
    }

    /// returns the owner of a particular plane
    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return planeToOwner[_tokenId];
    }

    /// transfers a plan from one address to another - private function to be called only by other functions
    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerPlaneCount[_to] = ownerPlaneCount[_to].add(1);
        ownerPlaneCount[msg.sender] = ownerPlaneCount[msg.sender].sub(1);
        planeToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    /// transfers from one address to another, only to be called by the initial owner of the plane
    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    /// approves the transfer of one plane to another person, to be called only by the origin owner
    function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        planeApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    /// takes ownership of a plane from another user, to be called by the intended recipient, requires prior approval by the original owner
    function takeOwnership(uint256 _tokenId) public {
        require(planeApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }

    //put plane on sale
    function sellPlane(uint256 _planeId, uint256 price) public onlyOwnerOf(_planeId) {
        if (planes[_planeId].sell == false) {
          planeSellCount[1] = planeSellCount[1] + 1;
        }
        planes[_planeId].sell = true;
        planes[_planeId].price = price;
    }

    function getPlanesForSale() external view returns(uint[]) {
        uint[] memory result = new uint[](planeSellCount[1]);
        uint counter = 0;
        for (uint i = 0; i < planes.length; i++) {
            if (planes[i].sell == true) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getPlanePrice(uint _planeId) public view returns(uint) {
        return planes[_planeId].price;
    }

    //transfer ownership of plane once money is received
    // function buyPlane(address _from, address _to, uint256 _planeId) payable public {
    //     require(planesForSale[_planeId] == true);
    //     if (msg.value == planeSellPrice[_planeId]) {
    //         planeToOwner[_planeId].transfer(msg.value);
    //         ownerPlaneCount[planeToOwner[_planeId]] = ownerPlaneCount[planeToOwner[_planeId]].sub(1);
    //         ownerPlaneCount[msg.sender] = ownerPlaneCount[msg.sender].add(1);
    //         planeToOwner[_planeId] = msg.sender;
    //         planesForSale[_planeId] = false;
    //     } else {
    //         revert();
    //     }
    // }
}
