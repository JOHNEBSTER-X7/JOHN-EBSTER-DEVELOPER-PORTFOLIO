// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * Educational two-token constant-product AMM pool.
 * Fee: 30 bps (0.30%). LP shares represent a proportional pool claim.
 */
contract ConstantProductPool is ERC20, ReentrancyGuard {
    using SafeERC20 for IERC20;
    IERC20 public immutable token0;
    IERC20 public immutable token1;
    uint256 public reserve0;
    uint256 public reserve1;
    uint256 public constant FEE_BPS = 30;
    uint256 public constant BPS = 10_000;

    event LiquidityAdded(address indexed provider, uint256 amount0, uint256 amount1, uint256 shares);
    event LiquidityRemoved(address indexed provider, uint256 amount0, uint256 amount1, uint256 shares);
    event Swap(address indexed trader, address indexed tokenIn, uint256 amountIn, uint256 amountOut, uint256 fee);

    constructor(address token0_, address token1_) ERC20("Northstar Pool Share", "NPS") {
        require(token0_ != address(0) && token1_ != address(0) && token0_ != token1_, "Invalid tokens");
        token0 = IERC20(token0_);
        token1 = IERC20(token1_);
    }

    function addLiquidity(uint256 amount0, uint256 amount1, uint256 minShares)
        external nonReentrant returns (uint256 shares)
    {
        require(amount0 > 0 && amount1 > 0, "Zero liquidity");
        uint256 supply = totalSupply();
        if (supply == 0) {
            shares = sqrt(amount0 * amount1);
        } else {
            require(reserve0 > 0 && reserve1 > 0, "Invalid reserves");
            uint256 shares0 = amount0 * supply / reserve0;
            uint256 shares1 = amount1 * supply / reserve1;
            shares = shares0 < shares1 ? shares0 : shares1;
        }
        require(shares > 0 && shares >= minShares, "Insufficient shares");
        token0.safeTransferFrom(msg.sender, address(this), amount0);
        token1.safeTransferFrom(msg.sender, address(this), amount1);
        reserve0 += amount0;
        reserve1 += amount1;
        _mint(msg.sender, shares);
        emit LiquidityAdded(msg.sender, amount0, amount1, shares);
    }

    function removeLiquidity(uint256 shares, uint256 min0, uint256 min1)
        external nonReentrant returns (uint256 amount0, uint256 amount1)
    {
        require(shares > 0 && balanceOf(msg.sender) >= shares, "Invalid shares");
        uint256 supply = totalSupply();
        amount0 = shares * reserve0 / supply;
        amount1 = shares * reserve1 / supply;
        require(amount0 >= min0 && amount1 >= min1, "Slippage exceeded");
        _burn(msg.sender, shares);
        reserve0 -= amount0;
        reserve1 -= amount1;
        token0.safeTransfer(msg.sender, amount0);
        token1.safeTransfer(msg.sender, amount1);
        emit LiquidityRemoved(msg.sender, amount0, amount1, shares);
    }

    function quote(uint256 amountIn, address tokenIn) public view returns (uint256 amountOut) {
        require(amountIn > 0, "Zero input");
        uint256 reserveIn;
        uint256 reserveOut;
        if (tokenIn == address(token0)) { reserveIn = reserve0; reserveOut = reserve1; }
        else if (tokenIn == address(token1)) { reserveIn = reserve1; reserveOut = reserve0; }
        else revert("Unsupported token");
        require(reserveIn > 0 && reserveOut > 0, "Empty pool");
        uint256 amountInWithFee = amountIn * (BPS - FEE_BPS);
        amountOut = amountInWithFee * reserveOut / (reserveIn * BPS + amountInWithFee);
    }

    function swapExactInput(address tokenIn, uint256 amountIn, uint256 minAmountOut)
        external nonReentrant returns (uint256 amountOut)
    {
        require(amountIn > 0, "Zero input");
        bool zeroForOne = tokenIn == address(token0);
        require(zeroForOne || tokenIn == address(token1), "Unsupported token");
        amountOut = quote(amountIn, tokenIn);
        require(amountOut >= minAmountOut, "Slippage exceeded");
        uint256 fee = amountIn * FEE_BPS / BPS;
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        if (zeroForOne) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
            token1.safeTransfer(msg.sender, amountOut);
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
            token0.safeTransfer(msg.sender, amountOut);
        }
        emit Swap(msg.sender, tokenIn, amountIn, amountOut, fee);
    }

    function spotPriceToken0InToken1() external view returns (uint256) {
        require(reserve0 > 0, "Empty pool");
        return reserve1 * 1e18 / reserve0;
    }

    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) { z = x; x = (y / x + x) / 2; }
        } else if (y != 0) { z = 1; }
    }
}
