import { ethers } from "hardhat";
async function main() {
  const [admin] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("PermissionedAssetToken");
  const token = await Token.deploy("Northstar Demo Asset", "NDA", admin.address);
  await token.waitForDeployment();
  const Registry = await ethers.getContractFactory("AssetRegistry");
  const registry = await Registry.deploy(admin.address);
  await registry.waitForDeployment();
  const Distribution = await ethers.getContractFactory("DistributionManager");
  const distribution = await Distribution.deploy(admin.address);
  await distribution.waitForDeployment();
  console.log(JSON.stringify({
    network: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: admin.address,
    token: await token.getAddress(),
    registry: await registry.getAddress(),
    distributionManager: await distribution.getAddress()
  }, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
