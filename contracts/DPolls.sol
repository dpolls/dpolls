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

    struct PollResponse {
        address responder;
        string response;
        uint256 weight;
        uint256 timestamp;
        bool isClaimed;
        uint256 reward;
    }

    struct PollSettings {
        uint256 rewardPerResponse;
        uint256 maxResponses;
        uint256 durationDays;
        uint256 minContribution;
        uint256 targetFund;
        uint256 endTime;
        uint256 totalResponses;
        uint256 funds;
    }

    struct PollContent {
        address creator;
        string subject;
        string description;
        string status;
        string[] options;
        bool isOpen;
    }

    struct Poll {
        PollContent content;
        PollSettings settings;
        PollResponse[] responses;
    }

    struct PollView {
        address creator;
        string subject;
        string description;
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
    mapping(address => Poll[]) private userPolls;

    event PollCreated(uint256 pollId, address creator, string subject);
    event PollUpdated(uint256 pollId, address creator, string sub);
    event PollClosed(uint256 pollId);
    event TargetFundUpdated(uint256 pollId, uint256 oldTarget, uint256 newTarget);

    function _initializePollContent(
        address creator,
        string memory subject,
        string memory description,
        string[] memory options
    ) private pure returns (PollContent memory) {
        return PollContent({
            creator: creator,
            subject: subject,
            description: description,
            status: "open",
            options: options,
            isOpen: true
        });
    }

    function _initializePollSettings(
        uint256 rewardPerResponse,
        uint256 durationDays,
        uint256 maxResponses,
        uint256 minContribution,
        uint256 targetFund
    ) private view returns (PollSettings memory) {
        return PollSettings({
            rewardPerResponse: rewardPerResponse,
            maxResponses: maxResponses,
            durationDays: durationDays,
            minContribution: minContribution,
            targetFund: targetFund,
            endTime: block.timestamp + (durationDays * 1 days),
            totalResponses: 0,
            funds: 0
        });
    }

    function createPoll(
        string memory subject,
        string memory description,
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
        require(targetFund >= rewardPerResponse * maxResponses, "Target fund must be greater than or equal to (reward per response x max responses)");

        PollContent memory content = _initializePollContent(msg.sender, subject, description, options);
        PollSettings memory settings = _initializePollSettings(
            rewardPerResponse,
            durationDays,
            maxResponses,
            minContribution,
            targetFund
        );

        Poll storage p = polls[pollCounter];
        p.content = content;
        p.settings = settings;

        pollIds.push(pollCounter);
        userPolls[msg.sender].push(p);

        emit PollCreated(pollCounter, msg.sender, subject);
        pollCounter++;
    }

    function submitResponse(uint256 pollId, string memory response) external payable nonReentrant {
        Poll storage p = polls[pollId];
        require(p.content.isOpen, "Poll is closed");
        require(block.timestamp < p.settings.endTime, "Poll has ended");
        require(p.settings.totalResponses < p.settings.maxResponses, "Max responses reached");

        p.responses.push(PollResponse({
            responder: msg.sender,
            response: response,
            weight: 1,
            timestamp: block.timestamp,
            isClaimed: false,
            reward: p.settings.rewardPerResponse
        }));
        p.settings.totalResponses++;
    }

    function closePoll(uint256 pollId) external {
        Poll storage p = polls[pollId];
        require(msg.sender == p.content.creator, "Not creator");
        require(p.content.isOpen, "Already closed");
        require(block.timestamp >= p.settings.endTime || p.settings.totalResponses >= p.settings.maxResponses, "Too early");

        p.content.isOpen = false;
        p.content.status = "closed";
        emit PollClosed(pollId);
    }

    function cancelPoll(uint256 pollId) external {
        Poll storage p = polls[pollId];
        require(msg.sender == p.content.creator, "Not creator");
        require(p.content.isOpen, "Already closed");

        p.content.isOpen = false;
        p.content.status = "cancelled";
        emit PollClosed(pollId);
    }

    function openPoll(uint256 pollId) external {
        Poll storage p = polls[pollId];
        require(msg.sender == p.content.creator, "Not creator");
        require(!p.content.isOpen, "Already open");

        p.content.isOpen = true;
        p.content.status = "open";
        p.settings.endTime = block.timestamp + (p.settings.durationDays * 1 days);
        emit PollUpdated(pollId, msg.sender, p.content.subject);
    }

    function getOptions(uint256 pollId) external view returns (string[] memory) {
        return polls[pollId].content.options;
    }

    function getPollStatus(uint256 pollId) external view returns (bool, uint256, uint256) {
        Poll storage p = polls[pollId];
        return (p.content.isOpen, p.settings.endTime, p.settings.totalResponses);
    }

    function getAllPollIds() external view returns (uint256[] memory) {
        return pollIds;
    }

    function getPoll(uint256 pollId) external view returns (PollView memory) {
        Poll storage p = polls[pollId];
        return PollView({
            creator: p.content.creator,
            subject: p.content.subject,
            description: p.content.description,
            options: p.content.options,
            rewardPerResponse: p.settings.rewardPerResponse,
            maxResponses: p.settings.maxResponses,
            endTime: p.settings.endTime,
            isOpen: p.content.isOpen,
            totalResponses: p.settings.totalResponses,
            funds: p.settings.funds
        });
    }

    function getPollResponses(uint256 pollId) external view returns (PollResponse[] memory) {
        return polls[pollId].responses;
    }

    function getUserPolls(address user) external view returns (Poll[] memory) {
        return userPolls[user];
    }

    function getUserActivePolls(address user) external view returns (Poll[] memory) {
        return userPolls[user];
    }

    function getActivePolls() external view returns (Poll[] memory) {
        uint256 activeCount = 0;
        
        // First count active polls
        for (uint256 i = 0; i < pollIds.length; i++) {
            if (polls[pollIds[i]].content.isOpen) {
                activeCount++;
            }
        }
        
        // Create array of active polls
        Poll[] memory activePolls = new Poll[](activeCount);
        uint256 currentIndex = 0;
        
        // Fill array with active polls
        for (uint256 i = 0; i < pollIds.length; i++) {
            if (polls[pollIds[i]].content.isOpen) {
                activePolls[currentIndex] = polls[pollIds[i]];
                currentIndex++;
            }
        }
        
        return activePolls;
    }

    function updateTargetFund(uint256 pollId, uint256 newTargetFund) external payable nonReentrant {
        Poll storage p = polls[pollId];
        require(msg.sender == p.content.creator, "Only creator can update target");
        require(p.content.isOpen, "Poll is not open");
        require(newTargetFund >= p.settings.minContribution, "New target must be >= min contribution");
        require(newTargetFund >= p.settings.funds, "New target must be >= current funds");

        uint256 oldTarget = p.settings.targetFund;
        p.settings.targetFund = newTargetFund;
        
        emit TargetFundUpdated(pollId, oldTarget, newTargetFund);
    }

    function fundPoll(uint256 pollId) external payable nonReentrant {
        Poll storage p = polls[pollId];
        require(p.content.isOpen, "Poll is not open");
        require(msg.value >= p.settings.minContribution, "Contribution below poll minimum");
        require(p.settings.funds + msg.value <= p.settings.targetFund, "Would exceed poll's target fund");
        
        p.settings.funds += msg.value;
    }
}
