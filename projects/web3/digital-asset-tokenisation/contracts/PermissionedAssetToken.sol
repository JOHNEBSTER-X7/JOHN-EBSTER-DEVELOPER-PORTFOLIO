// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * Educational permissioned ERC-20-style asset token.
 * Transfers require both sender and recipient to be allowlisted.
 * This is not a legal security-token standard or a production issuance contract.
 */
contract PermissionedAssetToken is ERC20, AccessControl, Pausable {
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    mapping(address => bool) public isAllowlisted;

    event InvestorAllowlistUpdated(address indexed investor, bool allowed);
    event Issuance(address indexed recipient, uint256 amount);

    constructor(string memory name_, string memory symbol_, address admin)
        ERC20(name_, symbol_)
    {
        require(admin != address(0), "Invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COMPLIANCE_ROLE, admin);
    }

    function setAllowlisted(address investor, bool allowed)
        external onlyRole(COMPLIANCE_ROLE)
    {
        require(investor != address(0), "Invalid investor");
        isAllowlisted[investor] = allowed;
        emit InvestorAllowlistUpdated(investor, allowed);
    }

    function mint(address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        require(isAllowlisted[to], "Recipient not allowlisted");
        _mint(to, amount);
        emit Issuance(to, amount);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }

    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        if (from != address(0)) require(isAllowlisted[from], "Sender not allowlisted");
        if (to != address(0)) require(isAllowlisted[to], "Recipient not allowlisted");
        super._update(from, to, value);
    }
}
