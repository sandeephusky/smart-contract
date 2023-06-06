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

> MintNFT.sol
> NFTDutchAuction.sol

Compilation:
============

Generating typings for: 15 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 44 typings!
Compiled 14 Solidity files successfully

Network Info
============
> HardhatEVM: v2.12.7
> network:    hardhat



  testNFTMint
    safeMintNFT
      ✔ Safe Mint NFT Owner's address (150ms)
      ✔ Safe Mint Non NFT Owner's address
      ✔ Successfully Mint and deploy auction (49ms)

  Bid - before minting contract approval
    ✔ Bid from the account which created the contract
    ✔ Bid from an account without approval from Minting Contract
    ✔ Approving the contract but failure due to token id not existing
    ✔ Approval Failure due to other user access
    ✔ Approving

  Bid after Approval
    ✔ Bid failure due to insufficient funds
    ✔ Bid failure due to bid less than reserve price
    ✔ Bid successful
    ✔ Bid failure as auction is closed


  12 passing (330ms)

----------------------|----------|----------|----------|----------|----------------|
File                  |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------------|----------|----------|----------|----------|----------------|
 contracts/           |      100 |       75 |      100 |      100 |                |
  MintNFT.sol         |      100 |       75 |      100 |      100 |                |
  NFTDutchAuction.sol |      100 |       75 |      100 |      100 |                |
----------------------|----------|----------|----------|----------|----------------|
All files             |      100 |       75 |      100 |      100 |                |
----------------------|----------|----------|----------|----------|----------------|
