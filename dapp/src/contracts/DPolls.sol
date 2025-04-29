// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PollsDApp {
    struct Poll {
        address creator;
        string question;
        string[] options;
        uint256 rewardPerResponse;
        uint256 maxResponses;
        uint256 endTime;
        bool isOpen;
        uint256 totalResponses;
        uint256 funds;
    }

    uint256 public pollCounter;
    uint256[] public pollIds;
    mapping(uint256 => Poll) public polls;

    event PollCreated(uint256 pollId, address creator, string question);
    event PollClosed(uint256 pollId);

    function createPoll(
        string memory question,
        string[] memory options,
        uint256 rewardPerResponse,
        uint256 durationDays,
        uint256 maxResponses
    ) external payable {
        require(options.length >= 2, "Need at least 2 options");
        require(durationDays > 0, "Invalid duration");

        Poll storage p = polls[pollCounter];
        p.creator = msg.sender;
        p.question = question;
        p.options = options;
        p.rewardPerResponse = rewardPerResponse;
        p.maxResponses = maxResponses;
        p.endTime = block.timestamp + (durationDays * 1 days);
        p.isOpen = true;
        p.funds = msg.value;

        pollIds.push(pollCounter);

        emit PollCreated(pollCounter, msg.sender, question);
        pollCounter++;
    }

    function closePoll(uint256 pollId) external {
        Poll storage p = polls[pollId];
        require(msg.sender == p.creator, "Not creator");
        require(p.isOpen, "Already closed");
        require(block.timestamp >= p.endTime || p.totalResponses >= p.maxResponses, "Too early");

        p.isOpen = false;
        emit PollClosed(pollId);
    }

    function getOptions(uint256 pollId) external view returns (string[] memory) {
        return polls[pollId].options;
    }

    function getPollStatus(uint256 pollId) external view returns (bool, uint256, uint256) {
        Poll storage p = polls[pollId];
        return (p.isOpen, p.endTime, p.totalResponses);
    }

    function getAllPollIds() external view returns (uint256[] memory) {
        return pollIds;
    }

    function getPoll(uint256 pollId) external view returns (
        address creator,
        string memory question,
        string[] memory options,
        uint256 rewardPerResponse,
        uint256 maxResponses,
        uint256 endTime,
        bool isOpen,
        uint256 totalResponses,
        uint256 funds
    ) {
        Poll storage p = polls[pollId];
        return (
            p.creator,
            p.question,
            p.options,
            p.rewardPerResponse,
            p.maxResponses,
            p.endTime,
            p.isOpen,
            p.totalResponses,
            p.funds
        );
    }

}
