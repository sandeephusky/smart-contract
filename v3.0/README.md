# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
Version
=======
> solidity-coverage: v0.8.2

Instrumenting for coverage...
=============================

> MintERC20Token.sol
> MintNFT.sol
> NFTDutchAuction_ERC20Bids.sol

Compilation:
============

Generating typings for: 20 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 60 typings!
Compiled 18 Solidity files successfully

Network Info
============
> HardhatEVM: v2.12.7
> network:    hardhat



  testMint
    ✔ Set ERC20 max supply (250ms)

  Tests for ERC721 and ERC20
    ✔ GCN minting by Owner
    ✔ GCN minting by other account
    ✔ Max limit reached for GCN Token
    safeMintNFT and deploy Dutch auction
      ✔ Safe Mint NFT Owner's address
      ✔ Safe Mint Non NFT Owner's address
      ✔ Deploy auction contract (69ms)

  Auction bids
    ✔ Before approving ERC20
    ✔ Approving ERC20

  Post Approval Process
    ✔ Seller trying to buy before ERC20 approval
    ✔ Bid before ERC721 approval
    ✔ Approving the contract but failure due to token id not existing
    ✔ Approval Failure due to other user access
    ✔ Approving

  Bid after Approval
    ✔ Bid failure due to insufficient funds
    ✔ Bid failure due to less than reserve price
    ✔ Successful bid
    ✔ Owner gets ERC token
    ✔ Bid failure as auction is closed


  19 passing (588ms)

--------------------------------|----------|----------|----------|----------|----------------|
File                            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------------------|----------|----------|----------|----------|----------------|
 contracts/                     |      100 |    83.33 |      100 |      100 |                |
  MintERC20Token.sol            |      100 |      100 |      100 |      100 |                |
  MintNFT.sol                   |      100 |       75 |      100 |      100 |                |
  NFTDutchAuction_ERC20Bids.sol |      100 |    83.33 |      100 |      100 |                |
--------------------------------|----------|----------|----------|----------|----------------|
All files                       |      100 |    83.33 |      100 |      100 |                |
--------------------------------|----------|----------|----------|----------|----------------|