export const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function transferFrom(address from, address to, uint amount) returns (bool)',
  'function approve(address spender, uint amount) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

export const ERC20_ABI_DPOLLS = [
  // Poll Creation and Management
  'function createPoll(string question, string[] options, uint256 rewardPerResponse, uint256 durationDays, uint256 maxResponses, uint256 minContribution, uint256 targetFund) external payable',
  'function closePoll(uint256 pollId) external',
  'function fundPoll(uint256 pollId) external payable',
  'function updateTargetFund(uint256 pollId, uint256 newTargetFund) external',
  
  // View Functions
  'function pollCounter() view returns (uint256)',
  'function pollIds(uint256) view returns (uint256)',
  'function polls(uint256) view returns (address creator, string question, uint256 rewardPerResponse, uint256 maxResponses, uint256 endTime, bool isOpen, uint256 totalResponses, uint256 funds, uint256 minContribution, uint256 targetFund)',
  'function getAllPollIds() view returns (uint256[])',
  'function getOptions(uint256 pollId) view returns (string[])',
  'function getPoll(uint256 pollId) view returns (address creator, string question, string[] options, uint256 rewardPerResponse, uint256 maxResponses, uint256 endTime, bool isOpen, uint256 totalResponses, uint256 funds, uint256 minContribution, uint256 targetFund)',
  'function getPollStatus(uint256 pollId) view returns (bool isOpen, uint256 endTime, uint256 totalResponses)',
  'function getUserPolls(address user) external view returns (tuple(address creator, string question, string[] options, uint256 rewardPerResponse, uint256 maxResponses, uint256 endTime, bool isOpen, uint256 totalResponses, uint256 funds, uint256 minContribution, uint256 targetFund)[])',
  
  // Events
  'event PollCreated(uint256 pollId, address creator, string question)',
  'event PollClosed(uint256 pollId)',
  'event TargetFundUpdated(uint256 pollId, uint256 oldTarget, uint256 newTarget)'
]

export const ERC721_ABI = [
  // Read-Only Functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',

  // Authenticated Functions
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns (bool)',
  'function safeTransferFrom(address from, address to, uint256 tokenId) returns (bool)',
  'function transferFrom(address from, address to, uint256 tokenId) returns (bool)',
  'function approve(address to, uint256 tokenId) returns (bool)',
  'function setApprovalForAll(address operator, bool approved) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
]
