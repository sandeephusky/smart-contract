# Dutch-Auction-smart-contract

An iterative project that allows sellers to auction any item and make the buyers to buy it using a custom ERC-20 token.

## Working of Dutch Auction:
A Dutch Auction works on a set time limit where the price keeps reducing over time until the base price is reched.

The buyer can bid a certain amount that it greater than or equal to the current price.

If successful, the buyer will get the auction item (an NFT in this case) and the money gets transferred to the seller (custom token here).

This project was done as part of the INFO 7500 Cryptocurrency and Smart Contract coursework and follows an iterative approach. A brief about all the versions:

### Version 1.0:
BasicDutchAuction - A basic Dutch Auction contract that allows us users to sell and buy items using bidding.

### Version 2.0:
NFTDuctionAuction - A Dutch Auction contract that allows us users to sell and buy NFTs using bidding.

### Versin 3.0:
NFTDuctionAuction_ERC20Bids - Implemented a ERC20 contract that allowed users to mint a custom token (GunnerCoin in this case) and bid for the NFTs using them.

### Version 4.0:
Upgradeability in Dutch Auction contract - Implemented Upgradeability for the Dutch Auction contract using UUPS proxy.

### Version 5.0:
Offchain signing - Implemented Off chain signing to help save gas fees

### Version 6.0:
UI for BasicDutchAuction -  Designed a simple UI for BasicDutchAuction (Version 1.0) which shows details about current seller's and buyer's wallet addresses and details about auction status.

### Version 7.0:
UI Deployment - Deployed the above version using IPFS which can be accessed here:

[ipns://k51qzi5uqu5djaqzr14lk3v2twomh3odmtyc5z3ftivd9l5mbdmmk4ni05bmwz](ipns://k51qzi5uqu5djaqzr14lk3v2twomh3odmtyc5z3ftivd9l5mbdmmk4ni05bmwz)

If the ipns url above is not working or is throwing 504 timeout error, install ipfs browser extension and try again
