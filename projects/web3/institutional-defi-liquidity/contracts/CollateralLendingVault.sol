// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IPriceOracle { function price(address asset) external view returns (uint256); }

/**
 * Minimal collateralised lending demonstration using externally supplied prices.
 * Assumes both assets have 18 decimals. No interest accrual or liquidation auctions.
 */
contract CollateralLendingVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    IERC20 public immutable collateralToken;
    IERC20 public immutable debtToken;
    IPriceOracle public immutable oracle;
    uint256 public constant LTV_BPS = 6_000;
    uint256 public constant LIQUIDATION_BONUS_BPS = 500;
    uint256 public constant BPS = 10_000;
    mapping(address => uint256) public collateralOf;
    mapping(address => uint256) public debtOf;

    event CollateralDeposited(address indexed borrower, uint256 amount);
    event CollateralWithdrawn(address indexed borrower, uint256 amount);
    event Borrowed(address indexed borrower, uint256 amount);
    event Repaid(address indexed borrower, uint256 amount);
    event Liquidated(address indexed borrower, address indexed liquidator, uint256 debtRepaid, uint256 collateralSeized);

    constructor(address collateral_, address debt_, address oracle_, address admin) Ownable(admin) {
        require(collateral_ != address(0) && debt_ != address(0) && collateral_ != debt_ && oracle_ != address(0), "Invalid configuration");
        collateralToken = IERC20(collateral_);
        debtToken = IERC20(debt_);
        oracle = IPriceOracle(oracle_);
    }

    function depositCollateral(uint256 amount) external nonReentrant {
        require(amount > 0, "Zero amount");
        collateralToken.safeTransferFrom(msg.sender, address(this), amount);
        collateralOf[msg.sender] += amount;
        emit CollateralDeposited(msg.sender, amount);
    }

    function withdrawCollateral(uint256 amount) external nonReentrant {
        require(amount > 0 && amount <= collateralOf[msg.sender], "Invalid amount");
        collateralOf[msg.sender] -= amount;
        require(isHealthy(msg.sender), "Would become undercollateralised");
        collateralToken.safeTransfer(msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, amount);
    }

    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0 && oracle.price(address(debtToken)) > 0, "Invalid debt price");
        debtOf[msg.sender] += amount;
        require(isHealthy(msg.sender), "Insufficient collateral");
        debtToken.safeTransfer(msg.sender, amount);
        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external nonReentrant {
        require(amount > 0 && amount <= debtOf[msg.sender], "Invalid repayment");
        debtToken.safeTransferFrom(msg.sender, address(this), amount);
        debtOf[msg.sender] -= amount;
        emit Repaid(msg.sender, amount);
    }

    function liquidate(address borrower, uint256 repayAmount) external nonReentrant {
        require(!isHealthy(borrower), "Position is healthy");
        require(repayAmount > 0 && repayAmount <= debtOf[borrower], "Invalid repayment");
        uint256 debtPrice = oracle.price(address(debtToken));
        uint256 collateralPrice = oracle.price(address(collateralToken));
        require(debtPrice > 0 && collateralPrice > 0, "Missing oracle price");
        uint256 debtValueUsd8 = repayAmount * debtPrice / 1e18;
        uint256 seizeAmount = debtValueUsd8 * (BPS + LIQUIDATION_BONUS_BPS) / BPS * 1e18 / collateralPrice;
        require(seizeAmount <= collateralOf[borrower], "Insufficient collateral");
        debtToken.safeTransferFrom(msg.sender, address(this), repayAmount);
        debtOf[borrower] -= repayAmount;
        collateralOf[borrower] -= seizeAmount;
        collateralToken.safeTransfer(msg.sender, seizeAmount);
        emit Liquidated(borrower, msg.sender, repayAmount, seizeAmount);
    }

    function isHealthy(address borrower) public view returns (bool) {
        uint256 debt = debtOf[borrower];
        if (debt == 0) return true;
        uint256 cp = oracle.price(address(collateralToken));
        uint256 dp = oracle.price(address(debtToken));
        if (cp == 0 || dp == 0) return false;
        uint256 collateralValue = collateralOf[borrower] * cp / 1e18;
        uint256 debtValue = debt * dp / 1e18;
        return debtValue * BPS <= collateralValue * LTV_BPS;
    }

    function healthFactor(address borrower) external view returns (uint256) {
        uint256 debt = debtOf[borrower];
        if (debt == 0) return type(uint256).max;
        uint256 cp = oracle.price(address(collateralToken));
        uint256 dp = oracle.price(address(debtToken));
        if (cp == 0 || dp == 0) return 0;
        uint256 collateralValue = collateralOf[borrower] * cp / 1e18;
        uint256 debtValue = debt * dp / 1e18;
        return debtValue == 0 ? type(uint256).max : collateralValue * 1e18 / debtValue;
    }
}
