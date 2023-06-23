import './App.css';
import { ethers, Contract, Signer } from 'ethers';
import { useState, useRef } from 'react';
import abi from './smartContractUtils/BasicDutchAuctionParametes.json';


function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const contractAbi = abi.abi;
  const contractByteCode = abi.bytecode;
  const inputRef = useRef();
  const [contractAddress, setContractAddress] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [userBal, setUserBal] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [ERC721Parameters, setContractParameters] = useState({
    reservePrice: "",
    numBlocksAuctionOpen: "",
    offerPriceDecrement: ""
  })
  const [contractShowUpDetails, setContractShowUpDetails] = useState({
    winner: "",
    currentPriceVal: "",
    reservePriceVal: "",
    numBlocksAuctionOpenVal: "",
    offerPriceDecrementVal: "",
    auctionStatus: ""
  })
  
  const [bidAmount, setBidAmount] = useState({
    "bidValue": "",
    "contractAddr": ""
  });

  const[contractDisplay, setContractDisplay] = useState({
    "contractAddrDisplay": ""
  })

  const connectWallet = () => {
    if (window.ethereum) {
      window.ethereum.request({method: 'eth_requestAccounts'})
      .then(result => {
        if(result.length != 0){
          setWalletAddress([result[0]]);
          getCurrentBalance(result[0]);
          console.log(walletAddress);
        }
        else
          console.error("No authorized account found");
      })
    } else {
      setErrorMessage('Please install MetaMask');
    }
  }
  const getCurrentBalance = (accountAddress) => {
    window.ethereum.request({method: 'eth_getBalance', params: [String(accountAddress), "latest"]})
    .then(balance => {
      setUserBalance(ethers.utils.formatEther(balance));
    })
  }

  const deployAuctionContract = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("Hello")
    console.log(setContractParameters);
    console.log(signer);
    const dutchAuctionContractFactory = new ethers.ContractFactory(contractAbi, contractByteCode, signer);
    console.log(dutchAuctionContractFactory)
    console.log(ERC721Parameters.reservePrice);
    const dutchAuctionContract = await dutchAuctionContractFactory.deploy(ERC721Parameters.reservePrice, ERC721Parameters.numBlocksAuctionOpen, ERC721Parameters.offerPriceDecrement);
    setContractAddress(dutchAuctionContract.address);
    // await dutchAuctionContract.deployed();
    let currPrc = await dutchAuctionContract.currentPrice();
    //let currentPrice = ethers.utils.formatEther(currPrc);
    console.log(contractAddress)
    console.log(parseInt(currPrc,10));
  }

  const contractValueHandler = (e) => {
    setContractParameters({
      ...ERC721Parameters,
      [e.target.name]: e.target.value
    });
  };

  const changeBidAmt = (e) => {
    setBidAmount({
      ...bidAmount,
      [e.target.name]: e.target.value
    });
    console.log(bidAmount)
  };

  const changeAddressDetails = (e) => {
    setContractDisplay({
      ...contractDisplay,
      [e.target.name]: e.target.value
    });
  }  

  const showContractDetails = async(e) => {
    e.preventDefault();
    try {
      console.log(contractDisplay)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(signer);
      const contractDetails = new ethers.Contract(contractDisplay.contractAddrDisplay, contractAbi, signer);
      console.log(contractDetails)
      var winner = await contractDetails.buyer();
      var auctionStatus = "Closed";
      console.log(winner);
      const currentAuctionPrice = await contractDetails.currentPrice();
      console.log(parseInt(currentAuctionPrice,10));
      var reservePricetemp = await contractDetails.reservePrice();
      var offerPriceDecrementtemp = await contractDetails.offerPriceDecrement();
      var numBlocksAuctionOpentemp = await contractDetails.numBlockAuctionOpen();
      console.log(parseInt(reservePricetemp,10));

      if(winner == "0x0000000000000000000000000000000000000000"){
        winner = "No winner declared";
        auctionStatus = "Open";
      }

      setContractShowUpDetails({
        winner: winner,
        currentPriceVal: parseInt(currentAuctionPrice,10),
        reservePriceVal: parseInt(reservePricetemp,10),
        numBlocksAuctionOpenVal: parseInt(numBlocksAuctionOpentemp,10),
        offerPriceDecrementVal: parseInt(offerPriceDecrementtemp,10),
        auctionStatus: auctionStatus
      })
    } catch (error) {
      window.alert(error.reason)
    }
  }

    console.log(contractShowUpDetails.currentPriceVal);
    console.log(contractShowUpDetails.reservePriceVal);
    console.log(contractShowUpDetails.numBlocksAuctionOpenVal);
    console.log(contractShowUpDetails.offerPriceDecrementVal);

  const bidFunction = async(e) => {
    //setBidAmount(bidAmount);
    try {
      console.log(bidAmount)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(signer);
      const auctionContract = new ethers.Contract(bidAmount.contractAddr, contractAbi, signer);
      console.log(auctionContract)
      const transaction = await auctionContract.bid({value: bidAmount.bidValue});
      window.alert("Bid Successfully Placed, winner will be announced soon");
    } catch (error) {
      window.alert(error.reason)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <u><b>MetaMask Wallet Connection</b></u>
        </p>
        <button onClick={connectWallet}>Connect Wallet</button>
        <div style={{ display: "inline-block", textAlign: "center" }}>
          <h3>Wallet Address: </h3>{walletAddress}
          <h3>User Balance: </h3>{userBalance} ETH
        </div>
        {
          errorMessage
        }
        <p>
          <u><b>Connect your contract</b></u>
        </p>
          <div>
            <label for="Reserve Price" > Reserve Price: </label> <input type="number" value={ERC721Parameters.reservePrice} name="reservePrice" onChange={contractValueHandler}/>
            <label for='Block count' > Number of blocks auction is open for: </label> <input type='number' value = {ERC721Parameters.numBlocksAuctionOpen} name="numBlocksAuctionOpen" onChange={contractValueHandler}/>
            <label for='Price Decrement' > Offer Price Decrement: </label> <input type='number' value = {ERC721Parameters.offerPriceDecrement} name="offerPriceDecrement" onChange={contractValueHandler}/>
          </div><br/>
          <button onClick={deployAuctionContract}>Deploy your Contract</button>
          <div>
            <p>Address of the deployed contract: {contractAddress}</p>
          </div><br/>

          <p>
            <u><b>Auction Info</b></u>
          </p>
            <div>
              <div>
                <label for="Contract Address" > Contract Address: </label> <input name="contractAddrDisplay" value={contractDisplay.contractAddrDisplay} onChange={changeAddressDetails}/>
              </div>
              <div>
                <button onClick={showContractDetails}>Show Details</button>
              </div>
              <div style={{overflow:"hidden", width:"auto"}}>
                <p>Winner of the Auction: {contractShowUpDetails.winner}</p>
                <p>Reserve Price: {contractShowUpDetails.reservePriceVal}</p>
                <p>Number of blocks auction is open for: {contractShowUpDetails.numBlocksAuctionOpenVal}</p>
                <p>offer Price Decrements by: {contractShowUpDetails.offerPriceDecrementVal}</p>
                <p>Current auction price: {contractShowUpDetails.currentPriceVal}</p>
                <p>Auction Status: {contractShowUpDetails.auctionStatus}</p>
              </div>
            </div>

          <p>
            <u><b>Make a Bid</b></u>
          </p>
            <div>
              <div>
              <label for="Contract Address" > Contract Address: </label> <input name="contractAddr" value={bidAmount.contractAddr} onChange={changeBidAmt}/>
                <label for="Bid Amount" > Bid Amount: </label> <input name="bidValue" value={bidAmount.bidValue} onChange={changeBidAmt}/>
              </div>
              <div>
                <button onClick={bidFunction}>Make a Bid</button>
              </div>
            </div>
      </header>
    </div>
  );
}

export default App;
