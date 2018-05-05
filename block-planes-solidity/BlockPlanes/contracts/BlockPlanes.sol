pragma solidity ^0.4.17;

import "./Ownable.sol";

contract BlockPlanes is Ownable {
  address public owner;

  constructor () public {
    owner = msg.sender;
  }

}
