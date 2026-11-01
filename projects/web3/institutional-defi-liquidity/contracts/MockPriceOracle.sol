// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/** Test-only price feed: prices are scaled to 1e8 USD units. */
contract MockPriceOracle is Ownable {
    mapping(address => uint256) public price;
    event PriceUpdated(address indexed asset, uint256 priceUsd8);
    constructor(address admin) Ownable(admin) {}
    function setPrice(address asset, uint256 priceUsd8) external onlyOwner {
        require(asset != address(0) && priceUsd8 > 0, "Invalid price");
        price[asset] = priceUsd8;
        emit PriceUpdated(asset, priceUsd8);
    }
}
