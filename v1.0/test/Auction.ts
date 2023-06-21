import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

describe("BasicDutchAuction", function () {
  let auction: Contract;
  let owner: Signer;
  let bidder1: Signer;
  let bidder2: Signer;

  const reservePrice = ethers.utils.parseEther("1.0");
  const numBlocksAuctionOpen = 10;
  const offerPriceDecrement = ethers.utils.parseEther("0.1");

  beforeEach(async () => {
    [owner, bidder1, bidder2] = await ethers.getSigners();

    const BasicDutchAuction: ContractFactory = await ethers.getContractFactory("BasicDutchAuction");
    auction = await BasicDutchAuction.deploy(reservePrice, numBlocksAuctionOpen, offerPriceDecrement);
    await auction.deployed();
  });

  it("should allow a bidder to place a higher bid", async function () {
    const bid1 = ethers.utils.parseEther("1.5");
    const bid2 = ethers.utils.parseEther("2.0");

    await auction.connect(bidder1).bid({ value: bid1 });
    await auction.connect(bidder2).bid({ value: bid2 });

    expect(await auction.highestBidder()).to.equal(await bidder2.getAddress());
    expect(await auction.highestBid()).to.equal(bid2);
  });

  it("should not allow bidding below the reserve price", async function () {
    const bid = ethers.utils.parseEther("0.5");

    await expect(auction.connect(bidder1).bid({ value: bid })).to.be.revertedWith("Bid amount is below the reserve price.");
  });

  it("should not allow ending the auction before the duration has elapsed", async function () {
    await ethers.provider.send("evm_increaseTime", [numBlocksAuctionOpen]); // Increase time to simulate auction duration
    await ethers.provider.send("evm_mine", []); // Mine a new block
    
    await expect(auction.connect(owner).endAuction()).to.be.revertedWith("Auction is still open.");
  });
  
  it("should not allow bidding after the auction has ended", async function () {
    const bid = ethers.utils.parseEther("1.5");

    await auction.connect(bidder1).bid({ value: bid });

    const auctionEndTime = parseInt((await auction.auctionEndTime()).toString());
    await ethers.provider.send("evm_increaseTime", [auctionEndTime]);
    await ethers.provider.send("evm_mine", []); // Mine a new block

    await expect(auction.connect(bidder2).bid({ value: bid })).to.be.revertedWith("Auction is no longer open.");
  });

  it("should not allow the winning bidder to refund", async function () {
    const bid1 = ethers.utils.parseEther("1.5");
    const bid2 = ethers.utils.parseEther("2.0");

    await auction.connect(bidder1).bid({ value: bid1 });
    await auction.connect(bidder2).bid({ value: bid2 });

    const auctionEndTime = await auction.auctionEndTime();
    await ethers.provider.send("evm_setNextBlockTimestamp", [auctionEndTime.toNumber()]); // Set the block timestamp
    await ethers.provider.send("evm_mine", []); // Mine a new block

    await auction.endAuction(); // End the auction

    await expect(auction.connect(bidder2).refund()).to.be.revertedWith("You cannot refund as the winning bidder.");
  });

  it("should allow a non-winning bidder to refund", async function () {
    const bid1 = ethers.utils.parseEther("1.5");
    const bid2 = ethers.utils.parseEther("2.0");

    await auction.connect(bidder1).bid({ value: bid1 });
    await auction.connect(bidder2).bid({ value: bid2 });

    const auctionEndTime = await auction.auctionEndTime();
    await ethers.provider.send("evm_setNextBlockTimestamp", [auctionEndTime.toNumber()]); // Set the block timestamp
    await ethers.provider.send("evm_mine", []); // Mine a new block

    await auction.endAuction(); // End the auction

    await expect(auction.connect(bidder1).refund()).to.emit(auction, "Refund");
  });

  it("should allow a non-winning bidder to withdraw their refund", async function () {
    const bid1 = ethers.utils.parseEther("1.5");
    const bid2 = ethers.utils.parseEther("2.0");

    await auction.connect(bidder1).bid({ value: bid1 });
    await auction.connect(bidder2).bid({ value: bid2 });

    const auctionEndTime = await auction.auctionEndTime();
    await ethers.provider.send("evm_setNextBlockTimestamp", [auctionEndTime.toNumber()]); // Set the block timestamp
    await ethers.provider.send("evm_mine", []); // Mine a new block

    await auction.endAuction(); // End the auction

    await expect(auction.connect(bidder1).withdrawRefund()).to.emit(auction, "RefundWithdrawal");
  });
});
