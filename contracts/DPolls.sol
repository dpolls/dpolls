// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PollsDApp {
    // Reentrancy Guard
    bool private locked;
    
    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }

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
        uint256 minContribution;  // Minimum contribution amount for this poll
        uint256 targetFund;      // Target/maximum fund amount for this poll
    }

    uint256 public pollCounter;
    uint256[] public pollIds;
    mapping(uint256 => Poll) public polls;
    mapping(address => Poll[]) private userPolls;

    event PollCreated(uint256 pollId, address creator, string question);
    event PollClosed(uint256 pollId);
    event TargetFundUpdated(uint256 pollId, uint256 oldTarget, uint256 newTarget);

    function createPoll(
        string memory question,
        string[] memory options,
        uint256 rewardPerResponse,
        uint256 durationDays,
        uint256 maxResponses,
        uint256 minContribution,
        uint256 targetFund
    ) external payable {
        require(options.length >= 2, "Need at least 2 options");
        require(durationDays > 0, "Invalid duration");
        require(minContribution > 0, "Min contribution must be positive");
        require(targetFund >= minContribution, "Target fund must be >= min contribution");

        Poll storage p = polls[pollCounter];
        p.creator = msg.sender;
        p.question = question;
        p.options = options;
        p.rewardPerResponse = rewardPerResponse;
        p.maxResponses = maxResponses;
        p.endTime = block.timestamp + (durationDays * 1 days);
        p.isOpen = true;
        p.minContribution = minContribution;
        p.targetFund = targetFund;

        pollIds.push(pollCounter);
        userPolls[msg.sender].push(p);

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

    // Get all polls for a user
    function getUserPolls(address user) external view returns (Poll[] memory) {
        return userPolls[user];
    }

    // Function to update the target fund of a poll
    function updateTargetFund(uint256 pollId, uint256 newTargetFund) external {
        Poll storage p = polls[pollId];
        require(msg.sender == p.creator, "Only creator can update target");
        require(p.isOpen, "Poll is not open");
        require(newTargetFund >= p.minContribution, "New target must be >= min contribution");
        require(newTargetFund >= p.funds, "New target must be >= current funds");

        uint256 oldTarget = p.targetFund;
        p.targetFund = newTargetFund;
        
        emit TargetFundUpdated(pollId, oldTarget, newTargetFund);
    }

    // Function to add funds to an existing poll
    function fundPoll(uint256 pollId) external payable nonReentrant {
        // Checks
        Poll storage p = polls[pollId];
        require(p.isOpen, "Poll is not open");
        require(msg.value >= p.minContribution, "Contribution below poll minimum");
        require(p.funds + msg.value <= p.targetFund, "Would exceed poll's target fund");
        
        // Effects
        uint256 newFunds = p.funds + msg.value;
        p.funds = newFunds;
        
        // No external calls after state changes
    }

}
