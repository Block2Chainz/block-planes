pragma solidity ^0.4.19;

import "./blockplanes.sol";
import "./helpers/erc721.sol";
import "./helpers/safemath.sol";

/// @title Handler for transferring plane ownership
/// @author Sean Malone, Joseph Nguyen, Nick Vrdoljak

contract PlaneOwnership is BlockPlanes, ERC721 {

    using SafeMath for uint256;

    mapping (uint => address) planeApprovals;

    modifier onlyOwnerOf(uint _planeId) {
        require(msg.sender == planeToOwner[_planeId]);
        _;
    }

    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerPlaneCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return planeToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerPlaneCount[_to] = ownerPlaneCount[_to].add(1);
        ownerPlaneCount[msg.sender] = ownerPlaneCount[msg.sender].sub(1);
        planeToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        planeApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(planeApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}
