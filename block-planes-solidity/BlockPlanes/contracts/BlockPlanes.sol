pragma solidity ^0.4.17;

contract BlockPlanes {
  address public owner;

  constructor () public {
    owner = msg.sender;
  }

}
