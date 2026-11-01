// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AssetRegistry is AccessControl {
    bytes32 public constant ASSET_MANAGER_ROLE = keccak256("ASSET_MANAGER_ROLE");
    struct Asset {
        string name;
        string assetType;
        string jurisdiction;
        string metadataURI;
        address issuer;
        bool active;
    }
    uint256 public nextAssetId = 1;
    mapping(uint256 => Asset) private assets;
    event AssetRegistered(uint256 indexed assetId, address indexed issuer, string name, string assetType);
    event AssetStatusChanged(uint256 indexed assetId, bool active);

    constructor(address admin) {
        require(admin != address(0), "Invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ASSET_MANAGER_ROLE, admin);
    }

    function registerAsset(
        string calldata name, string calldata assetType,
        string calldata jurisdiction, string calldata metadataURI, address issuer
    ) external onlyRole(ASSET_MANAGER_ROLE) returns (uint256 assetId) {
        require(bytes(name).length > 1 && bytes(assetType).length > 1, "Missing asset details");
        require(bytes(jurisdiction).length == 2, "Use ISO country code");
        require(issuer != address(0), "Invalid issuer");
        assetId = nextAssetId++;
        assets[assetId] = Asset(name, assetType, jurisdiction, metadataURI, issuer, true);
        emit AssetRegistered(assetId, issuer, name, assetType);
    }

    function setAssetActive(uint256 assetId, bool active) external onlyRole(ASSET_MANAGER_ROLE) {
        require(assets[assetId].issuer != address(0), "Unknown asset");
        assets[assetId].active = active;
        emit AssetStatusChanged(assetId, active);
    }

    function getAsset(uint256 assetId) external view returns (Asset memory) {
        require(assets[assetId].issuer != address(0), "Unknown asset");
        return assets[assetId];
    }
}
