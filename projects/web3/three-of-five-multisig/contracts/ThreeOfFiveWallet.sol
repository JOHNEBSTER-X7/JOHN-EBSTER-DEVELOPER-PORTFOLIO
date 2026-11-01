// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ThreeOfFiveWallet
/// @notice Educational native-asset multisig requiring 3 approvals from 5 unique owners.
/// @dev Demonstration code only. Obtain an independent security review before handling real assets.
contract ThreeOfFiveWallet {
    uint256 public constant OWNER_COUNT = 5;
    uint256 public constant REQUIRED_APPROVALS = 3;

    address[OWNER_COUNT] public owners;
    mapping(address => bool) public isOwner;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 approvalCount;
    }

    Transaction[] private transactions;
    mapping(uint256 => mapping(address => bool)) public isConfirmed;
    bool private executing;

    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event TransactionSubmitted(uint256 indexed transactionId, address indexed proposer, address indexed to, uint256 value);
    event TransactionConfirmed(uint256 indexed transactionId, address indexed owner);
    event ConfirmationRevoked(uint256 indexed transactionId, address indexed owner);
    event TransactionExecuted(uint256 indexed transactionId, address indexed executor);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier validTransaction(uint256 transactionId) {
        require(transactionId < transactions.length, "invalid transaction");
        _;
    }

    modifier nonReentrant() {
        require(!executing, "reentrant call");
        executing = true;
        _;
        executing = false;
    }

    constructor(address[OWNER_COUNT] memory initialOwners) {
        for (uint256 i = 0; i < OWNER_COUNT; i++) {
            address owner = initialOwners[i];
            require(owner != address(0), "zero owner");
            require(!isOwner[owner], "duplicate owner");
            isOwner[owner] = true;
            owners[i] = owner;
        }
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction(address to, uint256 value, bytes calldata data)
        external onlyOwner returns (uint256 transactionId)
    {
        require(to != address(0), "zero recipient");
        transactionId = transactions.length;
        transactions.push(Transaction({
            to: to, value: value, data: data, executed: false, approvalCount: 0
        }));
        emit TransactionSubmitted(transactionId, msg.sender, to, value);
        _confirm(transactionId, msg.sender);
    }

    function confirmTransaction(uint256 transactionId)
        external onlyOwner validTransaction(transactionId)
    {
        _confirm(transactionId, msg.sender);
    }

    function revokeConfirmation(uint256 transactionId)
        external onlyOwner validTransaction(transactionId)
    {
        Transaction storage txn = transactions[transactionId];
        require(!txn.executed, "already executed");
        require(isConfirmed[transactionId][msg.sender], "not confirmed");
        isConfirmed[transactionId][msg.sender] = false;
        txn.approvalCount -= 1;
        emit ConfirmationRevoked(transactionId, msg.sender);
    }

    function executeTransaction(uint256 transactionId)
        external onlyOwner validTransaction(transactionId) nonReentrant
    {
        Transaction storage txn = transactions[transactionId];
        require(!txn.executed, "already executed");
        require(txn.approvalCount >= REQUIRED_APPROVALS, "insufficient approvals");

        // Checks-effects-interactions: mark executed before the external call.
        txn.executed = true;
        (bool success,) = txn.to.call{value: txn.value}(txn.data);
        require(success, "execution failed");
        emit TransactionExecuted(transactionId, msg.sender);
    }

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 transactionId)
        external view validTransaction(transactionId)
        returns (address to, uint256 value, bytes memory data, bool executed, uint256 approvalCount)
    {
        Transaction storage txn = transactions[transactionId];
        return (txn.to, txn.value, txn.data, txn.executed, txn.approvalCount);
    }

    function _confirm(uint256 transactionId, address owner) private {
        Transaction storage txn = transactions[transactionId];
        require(!txn.executed, "already executed");
        require(!isConfirmed[transactionId][owner], "already confirmed");
        isConfirmed[transactionId][owner] = true;
        txn.approvalCount += 1;
        emit TransactionConfirmed(transactionId, owner);
    }
}
