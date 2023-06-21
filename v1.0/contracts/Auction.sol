// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract BasicDutchAuction {
    address payable public seller;
    uint public reservePrice;
    uint public numBlocksAuctionOpen;
    uint public offerPriceDecrement;
    uint public initialPrice;
    uint public auctionEndTime;
    bool public auctionEnded;
    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) private pendingReturns;
    
    event Refund(address bidder, uint amount);
    event RefundWithdrawal(address bidder, uint amount);

    constructor(
        uint _reservePrice,
        uint _numBlocksAuctionOpen,
        uint _offerPriceDecrement
    ) {
        seller = payable(msg.sender);
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;

        uint potentialInitialPrice = numBlocksAuctionOpen * offerPriceDecrement;
        require(potentialInitialPrice <= reservePrice, "Invalid auction parameters.");

        initialPrice = reservePrice - potentialInitialPrice;
        auctionEndTime = block.timestamp + (numBlocksAuctionOpen * 15 seconds); // Set the auction end time in seconds
        auctionEnded = false;
    }

    function bid() public payable {
        require(!auctionEnded, "Auction has already ended.");
        require(block.timestamp < auctionEndTime, "Auction is no longer open.");
        require(msg.value > highestBid, "There is already a higher bid.");
        require(msg.value >= reservePrice, "Bid amount is below the reserve price.");

        if (highestBidder != address(0)) {
            // Refund the previous highest bidder
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function endAuction() public {
        require(!auctionEnded, "Auction has already ended.");
        require(block.timestamp >= auctionEndTime, "Auction is still open.");

        auctionEnded = true;

        if (highestBidder != address(0)) {
            // Transfer the winning bid to the seller
            seller.transfer(highestBid);
        }
    }

    function refund() public {
        require(auctionEnded, "Auction has not ended.");
        require(msg.sender != highestBidder, "You cannot refund as the winning bidder.");

        // Retrieve the amount to be refunded
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to refund.");

        // Set the pending refund amount to zero
        pendingReturns[msg.sender] = 0;

        // Emit an event for the refund
        emit Refund(msg.sender, amount);
    }

    function withdrawRefund() public {
        require(auctionEnded, "Auction has not ended.");
        require(msg.sender != highestBidder, "Winning bidder cannot withdraw refund.");

        // Retrieve the refund amount for the sender
        uint refundAmount = pendingReturns[msg.sender];
        require(refundAmount > 0, "No funds to withdraw.");

        // Set the refund amount to zero before transferring
        pendingReturns[msg.sender] = 0;

        // Transfer the refund amount to the bidder
        payable(msg.sender).transfer(refundAmount);

        // Emit an event for the refund withdrawal
        emit RefundWithdrawal(msg.sender, refundAmount);
    }
}
