// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * Fixed-allocation claim simulation. Allocations are funded with native test ETH.
 * It does not calculate dividends, interest, yield or legally required distributions.
 */
contract DistributionManager is AccessControl, ReentrancyGuard {
    bytes32 public constant DISTRIBUTION_MANAGER_ROLE = keccak256("DISTRIBUTION_MANAGER_ROLE");
    struct Distribution {
        uint256 assetId;
        uint256 totalFunded;
        uint256 totalClaimed;
        bool active;
    }
    uint256 public nextDistributionId = 1;
    mapping(uint256 => Distribution) public distributions;
    mapping(uint256 => mapping(address => uint256)) public allocations;
    mapping(uint256 => mapping(address => bool)) public claimed;

    event DistributionCreated(uint256 indexed distributionId, uint256 indexed assetId, uint256 funded);
    event AllocationSet(uint256 indexed distributionId, address indexed investor, uint256 amount);
    event DistributionClaimed(uint256 indexed distributionId, address indexed investor, uint256 amount);

    constructor(address admin) {
        require(admin != address(0), "Invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(DISTRIBUTION_MANAGER_ROLE, admin);
    }

    function createDistribution(uint256 assetId) external payable onlyRole(DISTRIBUTION_MANAGER_ROLE) returns (uint256 id) {
        require(assetId > 0 && msg.value > 0, "Invalid distribution");
        id = nextDistributionId++;
        distributions[id] = Distribution(assetId, msg.value, 0, true);
        emit DistributionCreated(id, assetId, msg.value);
    }

    function setAllocation(uint256 id, address investor, uint256 amount) external onlyRole(DISTRIBUTION_MANAGER_ROLE) {
        Distribution storage d = distributions[id];
        require(d.active && investor != address(0) && amount > 0, "Invalid allocation");
        require(!claimed[id][investor], "Already claimed");
        uint256 old = allocations[id][investor];
        require(d.totalClaimed + amount <= d.totalFunded, "Allocation exceeds funding");
        allocations[id][investor] = amount;
        emit AllocationSet(id, investor, amount);
        old;
    }

    function claim(uint256 id) external nonReentrant {
        Distribution storage d = distributions[id];
        uint256 amount = allocations[id][msg.sender];
        require(d.active && amount > 0 && !claimed[id][msg.sender], "Not claimable");
        claimed[id][msg.sender] = true;
        d.totalClaimed += amount;
        (bool ok,) = payable(msg.sender).call{value: amount}("");
        require(ok, "Transfer failed");
        emit DistributionClaimed(id, msg.sender, amount);
    }

    function closeDistribution(uint256 id) external onlyRole(DISTRIBUTION_MANAGER_ROLE) {
        require(distributions[id].active, "Not active");
        distributions[id].active = false;
    }
}
