import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("testMint", function () {
  async function deployAuctionFixture() {

    const [owner, otherAccount] = await ethers.getSigners();

    const nftMintFactory = await ethers.getContractFactory("MintNFT");
    const nftMintToken = await nftMintFactory.deploy(5);

    const GCNMintFactory = await ethers.getContractFactory("Gunnercoin");
    const GCNMintToken = await GCNMintFactory.deploy(900);

    return { GCNMintToken, nftMintToken, owner, otherAccount };
  }

//   describe("Minting", function() {
    it("Set ERC20 max supply", async function() {
        const { GCNMintToken, owner, otherAccount } = await loadFixture(deployAuctionFixture);
        const maxGCNSupply = await GCNMintToken.getMaxGCNSupply();

        describe("Tests for ERC721 and ERC20", function() {

            it("GCN minting by Owner", async function() {
                expect(await GCNMintToken.mint(owner.address, 400));
            });

            it("GCN minting by other account", async function() {
                expect(await GCNMintToken.mint(otherAccount.address, 500));
            });

            it("Max limit reached for GCN Token", async function () {
              await expect(GCNMintToken.mint(otherAccount.address, 100)).to.be.revertedWith('Maximum amount of GCN minting has exceeded');
          });

            describe("safeMintNFT and deploy Dutch auction", function () {
                it("Safe Mint NFT Owner's address", async function () {
                  const { nftMintToken, owner } = await loadFixture(deployAuctionFixture);
            
                  expect( nftMintToken.safeMint(owner.address));
                });
            
                it("Safe Mint Non NFT Owner's address", async function () {
                  const { nftMintToken, otherAccount } = await loadFixture(deployAuctionFixture);
            
                  return expect(nftMintToken.connect(otherAccount).safeMint(otherAccount.address)).to.be.revertedWith("Ownable: caller is not the owner");
                });

                it("Deploy auction contract", async function() {
                    const { GCNMintToken, nftMintToken, owner, otherAccount } = await loadFixture(deployAuctionFixture);
                    expect(nftMintToken.safeMint(owner.address));

                    const nftDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction");
                    const nftDutchAuctionToken = await nftDutchAuctionFactory.deploy(GCNMintToken.address, nftMintToken.address, 0, 100, 20, 5);

                    //expect(await nftDutchAuctionToken.currentNFTOwner()).to.equal(owner.address);

                    describe("Auction bids", function() {
                        it("Before approving ERC20", async function(){
                            await expect(nftDutchAuctionToken.connect(otherAccount).bid(400)).to.be.revertedWith('Insufficient Gunnercoin in your account'); 
                        })
                        it("Approving ERC20", async function(){
                            await GCNMintToken.connect(otherAccount).approve(nftDutchAuctionToken.address, 400);
                            
                            describe("Post Approval Process", function(){
                                
                                it("Seller trying to buy before ERC20 approval", async function(){
                                    GCNMintToken.mint(otherAccount.address, 400);
                                    await expect(nftDutchAuctionToken.connect(owner).bid(400)).to.be.revertedWith('Sellers are not allowed to buy');
                                })

                                it("Bid before ERC721 approval", async function(){
                                    GCNMintToken.mint(otherAccount.address, 400);
                                    GCNMintToken.connect(otherAccount).approve(nftDutchAuctionToken.address, 400)
                                    await expect(nftDutchAuctionToken.connect(otherAccount).bid(400)).to.be.revertedWith('ERC721: caller is not token owner or approved');
                                })

                                it("Approving the contract but failure due to token id not existing", async function(){
                                    return expect(nftMintToken.approve(nftDutchAuctionToken.address, 9)).to.be.revertedWith('ERC721: invalid token ID');
                                });
                            
                                it("Approval Failure due to other user access", async function () {
                                    return expect(nftMintToken.connect(otherAccount).approve(nftDutchAuctionToken.address,0)).to.be.revertedWith('ERC721: approve caller is not token owner or approved for all');
                                });
                                it("Approving", async function () {
                                    const approvalResult = await nftMintToken.approve(nftDutchAuctionToken.address, 0);
                                    expect( nftMintToken.approve(nftDutchAuctionToken.address,1));
                                    
                                    describe("Bid after Approval", function () {
                                        it("Bid failure due to insufficient funds", async function () {
                                          await expect(nftDutchAuctionToken.connect(otherAccount).bid(50)).to.be.revertedWith('Insufficient Value');
                                        });
                    
                                        it("Bid failure due to less than reserve price", async function () {
                                            await expect(nftDutchAuctionToken.connect(otherAccount).bid(1)).to.be.revertedWith('Insufficient Value');;
                                        });
                    
                                        it("Successful bid", async function () {
                                            await expect(nftDutchAuctionToken.connect(otherAccount).bid(400));
                                        });

                                        it("Owner gets ERC token", async function () {
                                          expect(await GCNMintToken.balanceOf(owner.address)).to.equal(await nftDutchAuctionToken.currentPrice());
                                        });
                    
                                        it("Bid failure as auction is closed", async function () {
                                           await expect(nftDutchAuctionToken.connect(otherAccount).bid(110)).to.be.revertedWith('Auction Concluded');
                                        });
                                    });
                                    
                                });


                            })
                        });
                        
                       
                    })
            })

        })
    });
  });
});