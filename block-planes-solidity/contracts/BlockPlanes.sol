pragma solidity ^0.4.2;

contract BlockPlanes {
    // Model a Plane
    struct Plane {
        uint id;
        address owner;
        uint attributes;
    }
    // // Store accounts that have voted
    // mapping(address => bool) public voters;

    // // Store Candidates
    // // Fetch a Candidate
    // mapping(uint => Candidate) public candidates;
    // //       key      value

    // // Store Candidates Count
    // uint public candidatesCount;

    // // voted event
    // event votedEvent (
    //     uint indexed _candidateId
    // );

    // //Constructor
    // constructor () public {
    //     addCandidate("Candidate 1");
    //     addCandidate("Candidate 2");
    // }

    // function addCandidate (string _name) private {
    //     candidatesCount ++;
    //     candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    //     //              key                  value 
    // }

    // function vote (uint _candidateId) public {
    //     // user hasn't voted before
    //     require(!voters[msg.sender]);

    //     // voting for a valid candidate
    //     require(_candidateId > 0 && _candidateId <= candidatesCount);

    //     // record that voter has voted 
    //     voters[msg.sender] = true;

    //     // update candidate vote count
    //     candidates[_candidateId].voteCount++;

    //     // trigger event 
    //     emit votedEvent(_candidateId);
    // }
}