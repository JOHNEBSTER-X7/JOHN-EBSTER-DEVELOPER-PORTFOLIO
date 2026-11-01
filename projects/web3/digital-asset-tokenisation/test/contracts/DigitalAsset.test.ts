import { expect } from "chai";
import { ethers } from "hardhat";
import { describe,it } from "mocha";

describe("PermissionedAssetToken", function () {
  it("allows approved investor issuance and transfers", async function () {
    const [admin,alice,bob]=await ethers.getSigners();
    const Token=await ethers.getContractFactory("PermissionedAssetToken");
    const token=await Token.deploy("Northstar Asset","NSA",admin.address);
    await token.setAllowlisted(alice.address,true);
    await token.setAllowlisted(bob.address,true);
    await token.mint(alice.address,1000);
    await token.connect(alice).transfer(bob.address,250);
    expect(await token.balanceOf(bob.address)).to.equal(250);
  });
  it("blocks transfers to non-allowlisted wallets",async function(){
    const [admin,alice,bob]=await ethers.getSigners();
    const T=await ethers.getContractFactory("PermissionedAssetToken");
    const token=await T.deploy("Asset","AST",admin.address);
    await token.setAllowlisted(alice.address,true); await token.mint(alice.address,100);
    await expect(token.connect(alice).transfer(bob.address,10)).to.be.revertedWith("Recipient not allowlisted");
  });
  it("restricts allowlist changes to compliance role",async function(){
    const [admin,alice,bob]=await ethers.getSigners();
    const T=await ethers.getContractFactory("PermissionedAssetToken");
    const token=await T.deploy("Asset","AST",admin.address);
    await expect(token.connect(alice).setAllowlisted(bob.address,true)).to.be.reverted;
  });
  it("pauses token transfers",async function(){
    const [admin,alice]=await ethers.getSigners();
    const T=await ethers.getContractFactory("PermissionedAssetToken");
    const token=await T.deploy("Asset","AST",admin.address);
    await token.setAllowlisted(alice.address,true); await token.mint(alice.address,100);
    await token.pause();
    await expect(token.connect(alice).transfer(admin.address,1)).to.be.reverted;
  });
  it("registers an asset with an issuer and metadata reference",async function(){
    const [admin,issuer]=await ethers.getSigners();
    const R=await ethers.getContractFactory("AssetRegistry");
    const registry=await R.deploy(admin.address);
    await registry.registerAsset("Demo Solar Portfolio","renewable-energy","GB","ipfs://metadata",issuer.address);
    const asset=await registry.getAsset(1);
    expect(asset.name).to.equal("Demo Solar Portfolio"); expect(asset.issuer).to.equal(issuer.address);
  });
  it("rejects invalid asset jurisdiction",async function(){
    const [admin,issuer]=await ethers.getSigners();
    const R=await ethers.getContractFactory("AssetRegistry");
    const registry=await R.deploy(admin.address);
    await expect(registry.registerAsset("Demo Asset","real-estate","United Kingdom","",issuer.address)).to.be.revertedWith("Use ISO country code");
  });
  it("funds and pays a fixed allocation once",async function(){
    const [admin,investor]=await ethers.getSigners();
    const D=await ethers.getContractFactory("DistributionManager");
    const manager=await D.deploy(admin.address);
    await manager.createDistribution(1,{value:ethers.parseEther("1")});
    await manager.setAllocation(1,investor.address,ethers.parseEther("0.25"));
    await expect(manager.connect(investor).claim(1)).to.changeEtherBalance(investor,ethers.parseEther("0.25"));
    await expect(manager.connect(investor).claim(1)).to.be.revertedWith("Not claimable");
  });
  it("prevents allocations exceeding funded value",async function(){
    const [admin,investor]=await ethers.getSigners();
    const D=await ethers.getContractFactory("DistributionManager");
    const manager=await D.deploy(admin.address);
    await manager.createDistribution(1,{value:ethers.parseEther("1")});
    await expect(manager.setAllocation(1,investor.address,ethers.parseEther("2"))).to.be.revertedWith("Allocation exceeds funding");
  });
});
