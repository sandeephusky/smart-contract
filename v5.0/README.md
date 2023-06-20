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
Network Info
============
> HardhatEVM: v2.13.0
> network:    hardhat



  testMint
    ✔ Set ERC20 max supply (353ms)

  Tests for ERC721 and ERC20
    ✔ GCN minting by Owner (40ms)
    ✔ GCN minting by other account (41ms)
    ✔ Max limit reached for GCN Token (45ms)
    safeMintNFT and deploy Dutch auction
      ✔ Safe Mint NFT Owner's address
      ✔ Safe Mint Non NFT Owner's address
      ✔ Deploy auction contract (365ms)

  Auction bids
    ✔ Before approving ERC20 (42ms)
0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
    ✔ ERC20 Permit Rejection due to invalid signature (76ms)
0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
    ✔ Approving ERC20 (54ms)

  Post Approval Process
    ✔ Seller trying to buy before ERC20 approval (52ms)
    ✔ Bid before ERC721 approval (73ms)
    ✔ Approving the contract but failure due to token id not existing
    ✔ Approval Failure due to other user access
    ✔ Approving

  Bid after Approval
    ✔ Bid failure due to insufficient funds
    ✔ Bid failure due to less than reserve price
    ✔ Successful bid
    ✔ Owner gets ERC token (71ms)
    ✔ Bid failure as auction is closed


  20 passing (1s)

--------------------------------|----------|----------|----------|----------|----------------|
File                            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------------------|----------|----------|----------|----------|----------------|
 contracts/                     |      100 |    72.73 |    88.89 |      100 |                |
  MintERC20Token.sol            |      100 |      100 |      100 |      100 |                |
  MintNFT.sol                   |      100 |       75 |      100 |      100 |                |
  NFTDutchAuction_ERC20Bids.sol |      100 |    68.75 |       75 |      100 |                |
--------------------------------|----------|----------|----------|----------|----------------|
All files                       |      100 |    72.73 |    88.89 |      100 |                |
--------------------------------|----------|----------|----------|----------|----------------|