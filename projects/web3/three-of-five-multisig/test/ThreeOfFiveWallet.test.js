const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ThreeOfFiveWallet", function () {
  let owners;
  let outsider;
  let recipient;
  let wallet;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owners = signers.slice(0, 5);
    outsider = signers[5];
    recipient = signers[6];

    const Wallet = await ethers.getContractFactory("ThreeOfFiveWallet");
    wallet = await Wallet.deploy(owners.map((owner) => owner.address));
    await wallet.waitForDeployment();
  });

  it("sets exactly five unique owners", async function () {
    for (let i = 0; i < owners.length; i += 1) {
      expect(await wallet.owners(i)).to.equal(owners[i].address);
      expect(await wallet.isOwner(owners[i].address)).to.equal(true);
    }
    expect(await wallet.isOwner(outsider.address)).to.equal(false);
  });

  it("rejects zero and duplicate owners", async function () {
    const Wallet = await ethers.getContractFactory("ThreeOfFiveWallet");
    const addresses = owners.map((owner) => owner.address);

    await expect(Wallet.deploy([addresses[0], addresses[0], ...addresses.slice(2)]))
      .to.be.revertedWith("duplicate owner");
    await expect(Wallet.deploy([ethers.ZeroAddress, ...addresses.slice(1)]))
      .to.be.revertedWith("zero owner");
  });

  it("allows deposits and emits a deposit event", async function () {
    const amount = ethers.parseEther("1");
    await expect(owners[0].sendTransaction({ to: await wallet.getAddress(), value: amount }))
      .to.emit(wallet, "Deposit").withArgs(owners[0].address, amount, amount);
    expect(await ethers.provider.getBalance(await wallet.getAddress())).to.equal(amount);
  });

  it("requires three distinct approvals before execution", async function () {
    const amount = ethers.parseEther("1");
    const payment = ethers.parseEther("0.4");
    await owners[0].sendTransaction({ to: await wallet.getAddress(), value: amount });

    await expect(wallet.connect(owners[0]).submitTransaction(recipient.address, payment, "0x"))
      .to.emit(wallet, "TransactionSubmitted");
    await expect(wallet.connect(owners[0]).executeTransaction(0))
      .to.be.revertedWith("insufficient approvals");

    await wallet.connect(owners[1]).confirmTransaction(0);
    await expect(wallet.connect(owners[1]).confirmTransaction(0))
      .to.be.revertedWith("already confirmed");
    await wallet.connect(owners[2]).confirmTransaction(0);

    const before = await ethers.provider.getBalance(recipient.address);
    await wallet.connect(owners[4]).executeTransaction(0);
    const after = await ethers.provider.getBalance(recipient.address);

    expect(after - before).to.equal(payment);
    const txn = await wallet.getTransaction(0);
    expect(txn.executed).to.equal(true);
    expect(txn.approvalCount).to.equal(3n);
  });

  it("allows an owner to revoke confirmation before execution", async function () {
    await wallet.connect(owners[0]).submitTransaction(recipient.address, 0, "0x");
    await wallet.connect(owners[1]).confirmTransaction(0);
    await wallet.connect(owners[1]).revokeConfirmation(0);

    const txn = await wallet.getTransaction(0);
    expect(txn.approvalCount).to.equal(1n);
    expect(await wallet.isConfirmed(0, owners[1].address)).to.equal(false);
  });

  it("rejects calls from non-owners", async function () {
    await expect(wallet.connect(outsider).submitTransaction(recipient.address, 0, "0x"))
      .to.be.revertedWith("not owner");
  });

  it("rejects zero-address recipients and invalid transaction IDs", async function () {
    await expect(wallet.connect(owners[0]).submitTransaction(ethers.ZeroAddress, 0, "0x"))
      .to.be.revertedWith("zero recipient");
    await expect(wallet.connect(owners[0]).confirmTransaction(99))
      .to.be.revertedWith("invalid transaction");
  });

  it("rejects execution of an already executed transaction", async function () {
    await wallet.connect(owners[0]).submitTransaction(recipient.address, 0, "0x");
    await wallet.connect(owners[1]).confirmTransaction(0);
    await wallet.connect(owners[2]).confirmTransaction(0);
    await wallet.connect(owners[0]).executeTransaction(0);
    await expect(wallet.connect(owners[0]).executeTransaction(0))
      .to.be.revertedWith("already executed");
  });

  it("rolls back execution state when the external call fails", async function () {
    await wallet.connect(owners[0]).submitTransaction(recipient.address, ethers.parseEther("1"), "0x");
    await wallet.connect(owners[1]).confirmTransaction(0);
    await wallet.connect(owners[2]).confirmTransaction(0);
    await expect(wallet.connect(owners[0]).executeTransaction(0))
      .to.be.revertedWith("execution failed");
    const txn = await wallet.getTransaction(0);
    expect(txn.executed).to.equal(false);
  });
});
