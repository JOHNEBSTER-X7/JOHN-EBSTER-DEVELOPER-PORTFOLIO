import { expect } from "chai";
import { ethers } from "hardhat";
import { describe,it } from "mocha";

describe("Northstar DeFi protocol",function(){
 async function deployPool(){
  const [admin,alice,bob]=await ethers.getSigners();
  const T=await ethers.getContractFactory("MockERC20");
  const a=await T.deploy("Token A","TKA"),b=await T.deploy("Token B","TKB");
  const P=await ethers.getContractFactory("ConstantProductPool");
  const pool=await P.deploy(await a.getAddress(),await b.getAddress());
  const unit=ethers.parseEther("1");
  await a.mint(alice.address,ethers.parseEther("10000")); await b.mint(alice.address,ethers.parseEther("10000"));
  await a.connect(alice).approve(await pool.getAddress(),ethers.MaxUint256); await b.connect(alice).approve(await pool.getAddress(),ethers.MaxUint256);
  return {admin,alice,bob,a,b,pool,unit};
 }
 it("adds liquidity and mints LP shares",async()=>{
  const {alice,a,b,pool}=await deployPool();
  await pool.connect(alice).addLiquidity(ethers.parseEther("100"),ethers.parseEther("200"),1);
  expect(await pool.balanceOf(alice.address)).to.equal(ethers.parseEther("141.421356237309504880"));
  expect(await pool.reserve0()).to.equal(ethers.parseEther("100"));
 });
 it("quotes and executes a fee-bearing swap",async()=>{
  const {alice,a,b,pool}=await deployPool();
  await pool.connect(alice).addLiquidity(ethers.parseEther("100"),ethers.parseEther("100"),1);
  const quote=await pool.quote(ethers.parseEther("1"),await a.getAddress());
  await a.connect(alice).approve(await pool.getAddress(),ethers.MaxUint256);
  const before=await b.balanceOf(alice.address);
  await pool.connect(alice).swapExactInput(await a.getAddress(),ethers.parseEther("1"),quote);
  expect(await b.balanceOf(alice.address)).to.equal(before+quote);
 });
 it("enforces swap slippage limits",async()=>{
  const {alice,a,pool}=await deployPool();
  await pool.connect(alice).addLiquidity(ethers.parseEther("100"),ethers.parseEther("100"),1);
  await expect(pool.connect(alice).swapExactInput(await a.getAddress(),ethers.parseEther("1"),ethers.parseEther("2"))).to.be.revertedWith("Slippage exceeded");
 });
 it("returns proportional liquidity on burn",async()=>{
  const {alice,pool}=await deployPool();
  await pool.connect(alice).addLiquidity(ethers.parseEther("100"),ethers.parseEther("100"),1);
  const shares=await pool.balanceOf(alice.address);
  await pool.connect(alice).removeLiquidity(shares/2n,0,0);
  expect(await pool.totalSupply()).to.equal(shares-shares/2n);
 });
 it("rejects unsupported swap tokens",async()=>{
  const {alice,pool}=await deployPool();
  await expect(pool.connect(alice).quote(100,alice.address)).to.be.revertedWith("Unsupported token");
 });
});

describe("CollateralLendingVault",function(){
 async function deployVault(){
  const [admin,borrower,liquidator]=await ethers.getSigners();
  const T=await ethers.getContractFactory("MockERC20");
  const collateral=await T.deploy("Collateral","COL"),debt=await T.deploy("Debt","DEBT");
  const O=await ethers.getContractFactory("MockPriceOracle");
  const oracle=await O.deploy(admin.address);
  await oracle.setPrice(await collateral.getAddress(),100_000_000);
  await oracle.setPrice(await debt.getAddress(),100_000_000);
  const V=await ethers.getContractFactory("CollateralLendingVault");
  const vault=await V.deploy(await collateral.getAddress(),await debt.getAddress(),await oracle.getAddress(),admin.address);
  await collateral.mint(borrower.address,ethers.parseEther("100"));
  await debt.mint(await vault.getAddress(),ethers.parseEther("1000"));
  await debt.mint(liquidator.address,ethers.parseEther("1000"));
  await collateral.connect(borrower).approve(await vault.getAddress(),ethers.MaxUint256);
  await debt.connect(borrower).approve(await vault.getAddress(),ethers.MaxUint256);
  await debt.connect(liquidator).approve(await vault.getAddress(),ethers.MaxUint256);
  return {admin,borrower,liquidator,collateral,debt,oracle,vault};
 }
 it("accepts collateral and borrows within the configured LTV",async()=>{
  const {borrower,collateral,vault}=await deployVault();
  await vault.connect(borrower).depositCollateral(ethers.parseEther("10"));
  await vault.connect(borrower).borrow(ethers.parseEther("5"));
  expect(await vault.debtOf(borrower.address)).to.equal(ethers.parseEther("5"));
  expect(await vault.isHealthy(borrower.address)).to.equal(true);
 });
 it("rejects borrowing above the collateral limit",async()=>{
  const {borrower,vault}=await deployVault();
  await vault.connect(borrower).depositCollateral(ethers.parseEther("10"));
  await expect(vault.connect(borrower).borrow(ethers.parseEther("7"))).to.be.revertedWith("Insufficient collateral");
 });
 it("blocks collateral withdrawal that would breach LTV",async()=>{
  const {borrower,vault}=await deployVault();
  await vault.connect(borrower).depositCollateral(ethers.parseEther("10"));
  await vault.connect(borrower).borrow(ethers.parseEther("5"));
  await expect(vault.connect(borrower).withdrawCollateral(ethers.parseEther("2"))).to.be.revertedWith("Would become undercollateralised");
 });
 it("repays outstanding debt",async()=>{
  const {borrower,vault}=await deployVault();
  await vault.connect(borrower).depositCollateral(ethers.parseEther("10"));
  await vault.connect(borrower).borrow(ethers.parseEther("5"));
  await vault.connect(borrower).repay(ethers.parseEther("2"));
  expect(await vault.debtOf(borrower.address)).to.equal(ethers.parseEther("3"));
 });
 it("liquidates an unhealthy position after an oracle price fall",async()=>{
  const {admin,borrower,liquidator,collateral,debt,oracle,vault}=await deployVault();
  await vault.connect(borrower).depositCollateral(ethers.parseEther("10"));
  await vault.connect(borrower).borrow(ethers.parseEther("5"));
  await oracle.connect(admin).setPrice(await collateral.getAddress(),50_000_000);
  expect(await vault.isHealthy(borrower.address)).to.equal(false);
  await vault.connect(liquidator).liquidate(borrower.address,ethers.parseEther("1"));
  expect(await vault.debtOf(borrower.address)).to.equal(ethers.parseEther("4"));
 });
});
