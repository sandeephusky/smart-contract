import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("testNFTMint", function () {
  async function deployAuctionFixture() {
    
    const [owner, otherAccount] = await ethers.getSigners();

    const nftMintFactory = await ethers.getContractFactory("MintNFT");
    const nftMintToken = await nftMintFactory.deploy(5);

    return { nftMintToken, owner, otherAccount };
  }

  describe("safeMintNFT", function () {
    it("Safe Mint NFT Owner's address", async function () {
      const { nftMintToken, owner } = await loadFixture(deployAuctionFixture);

      expect(await nftMintToken.safeMint(owner.address));
    });

    it("Safe Mint Non NFT Owner's address", async function () {
      const { nftMintToken, otherAccount } = await loadFixture(deployAuctionFixture);

      return expect(nftMintToken.connect(otherAccount).safeMint(otherAccount.address)).eventually.to.rejectedWith("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner");
    });

    it("Successfully Mint and deploy auction", async function () {
      const { nftMintToken, owner, otherAccount } = await loadFixture(deployAuctionFixture);

      expect(nftMintToken.safeMint(owner.address));

      const nftDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction");
      const nftDutchAuctionToken = await nftDutchAuctionFactory.deploy(nftMintToken.address, 0, 1000, 10, 5);

    

    // it("Bid from buyer account - Greater than the current price", async function () {
    //   const { basicDutchAuctionToken, otherAccount } = await loadFixture(deployAuctionFixture);

    //   expect(basicDutchAuctionToken.connect(otherAccount.address).bid({from: otherAccount.address, value: 400 }));
    // });

    describe("Bid - before minting contract approval", function () {
      it("Bid from the account which created the contract", async function () {
           expect(nftDutchAuctionToken.connect(owner).bid({value:200})).to.be.revertedWith('Sellers are not allowed to buy');
      });

      it("Bid from an account without approval from Minting Contract", async function () {
         expect(nftDutchAuctionToken.connect(otherAccount).bid({value:200})).to.be.revertedWith('ERC721: caller is not token owner or approved');
    });

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
                 expect(nftDutchAuctionToken.connect(otherAccount).bid({from: otherAccount.address, value: 50 })).to.be.revertedWith('Insufficient Funds');
            });

            it("Bid failure due to bid less than reserve price", async function () {
                 expect(nftDutchAuctionToken.connect(otherAccount).bid({from: otherAccount.address, value: 1 })).to.be.revertedWith('Place a bid greater than reserve price');;
            });

            it("Bid successful", async function () {
                 expect(nftDutchAuctionToken.connect(otherAccount).bid({from: otherAccount.address, value: 1200 }));
            });

            it("Bid failure as auction is closed", async function () {
                expect(nftDutchAuctionToken.connect(otherAccount).bid({from: otherAccount.address, value: 210 })).to.be.revertedWith('Auction is closed');;
            });
        });
        
    });
    // expect( nftDutchAuctionToken.currentNFTOwner()).to.equal(otherAccount.address);
});

});

});
});