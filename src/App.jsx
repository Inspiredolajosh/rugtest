import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.scss";
import pepe from "../src/assets/img/RUGG.png";
import Form from "./components/form/Form";
import NavBar from "./components/navbar/NavBar";
import abi from "../rugtoken.json";
import { provider, contract, contractAddress } from './ethConfig';
import eligibleAddresses from "../eligibleaddresses.json";

const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [networkChainId, setNetworkChainId] = useState(null);

  

  const getConnectedAccountFromStorage = () => {
    return localStorage.getItem("connectedAccount");
  };

  useEffect(() => {
    const storedAccount = getConnectedAccountFromStorage();
    if (storedAccount) {
      setDefaultAccount(storedAccount);
      setIsConnected(true);
    }
    logContractConnection();
    updateNetworkChainId();
  }, []);

  const updateNetworkChainId = async () => {
    try {
      const network = await provider.getNetwork();
      setNetworkChainId(network.chainId);
    } catch (error) {
      console.error("Failed to get network information:", error);
    }
  };

  const logContractConnection = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      console.log("Contract connected");
      console.log("Connected contract address:", contractAddress);
      try {
        const network = await contract.signer.provider.getNetwork();
        console.log("Connected network chainId:", network.chainId);
      } catch (error) {
        console.error("Failed to get network information:", error);
      }
    } else {
      console.log("Contract not connected");
    }
  };

  const connectWallet = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            accountChanged(result[0]);
          })
          .catch((error) => {
            console.error(error);
            window.alert("Failed to connect to the wallet.");
          });
      } else {
        window.alert("Please install Metamask or another Ethereum wallet provider to connect.");
      }
    }
  };

  const disconnectWallet = () => {
    setDefaultAccount(null);
    setIsConnected(false);
    setErrorMessage(null);
    localStorage.removeItem("connectedAccount");
  };

  const accountChanged = (accountName) => {
    setDefaultAccount(accountName);
    setIsConnected(true);
  };

  const addNotification = (message, type) => {
    const newNotification = { message, type };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

    setTimeout(() => {
      removeNotification(newNotification);
    }, 20000);
  };

  const removeNotification = (notificationToRemove) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification !== notificationToRemove)
    );
  };

  const claimFirstAirdrop = async () => {
    try {
      // console.log("Claim Airdrop button clicked.");
  
      const network = await provider.getNetwork();
      // console.log("Current network:", network);
      const allowedNetworks = [56, 97]; // Array of allowed network chainIds
  
      if (!allowedNetworks.includes(network.chainId)) {
        setErrorMessage("Please switch to the Binance mainnet to claim the airdrop.");
        // console.log("Ok.");
        addNotification("Please switch to the Binance mainnet to claim the airdrop.", NOTIFICATION_TYPES.ERROR);
        return;
      }
  
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      // console.log("User address:", userAddress);
  
      const lowercaseUserAddress = userAddress.toLowerCase();
  
      const lowercaseEligibleAddresses = eligibleAddresses.map(address => address.toLowerCase());
  
      if (!lowercaseEligibleAddresses.includes(lowercaseUserAddress)) {
        setErrorMessage("Sorry, Address not on whitelist.");
        // console.log("Address not allowed to claim.");
        addNotification("Sorry, Address not on whitelist.", NOTIFICATION_TYPES.ERROR);
        return;
      }
  
      const hasClaimedFirst = await contract.callStatic.checkFirstAirdropClaimStatus(userAddress);
    if (hasClaimedFirst) {
      setErrorMessage("Airdrop has already been claimed.");
      addNotification("Airdrop has already been claimed.", NOTIFICATION_TYPES.INFO);
      return;
    }
      const transactionParameters = {
        value: ethers.utils.parseEther("0.0022"),
      };
  
      const contractWithSigner = contract.connect(signer);
      const transaction = await contractWithSigner.claimFirstAirdrop(transactionParameters);
  
      await transaction.wait();
  
      setErrorMessage("Airdrop claimed successfully!");
      addNotification("Airdrop claimed successfully!", NOTIFICATION_TYPES.SUCCESS);
  
  
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to claim airdrop, please check your connection.");
      addNotification("Failed to claim airdrop, please check your connection.", NOTIFICATION_TYPES.ERROR);
    }
  };
  
  
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications([]);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  
  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to switch network. Please switch EVM Network to BSC in your wallet.");
    }
  };

  return (
    <div className="app">
      <div className="container">
        <NavBar
          isConnected={isConnected}
          connectWallet={connectWallet}
          defaultAccount={defaultAccount}
          disconnectWallet={disconnectWallet}
          switchNetwork={switchNetwork}
          isBscNetwork={networkChainId === "0x61"}
        />

        <div className="intro">
          <div className="container">
            <img src={pepe} alt="pepe" />
            <h1>RUGG TOKENS</h1>
          </div>
        </div>
        {/* Form */}
        <Form eligibleAddresses={eligibleAddresses} setNotifications={setNotifications} />
        
        <div className="referal">
          <div className="container">
            <button
              className="btn"
              onClick={claimFirstAirdrop}
              style={{
                padding: "8px 15px",
                width: "100%",
                borderRadius: "5px",
                fontSize: "14px",
                background: "#d36a24",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                marginTop: "-20px",
              }}
            >
              Claim Airdrop
            </button>
          </div>
        </div>

        <div style={{ position: "fixed", top: "20px", right: "20px", display: "flex", flexDirection: "column", alignItems: "flex-end", zIndex: "999" }}>
        
        {notifications.map((notification, index) => (
          <div
            key={index}
            style={{
              padding: "10px 15px",
              margin: "5px 0",
              borderRadius: "5px",
              fontSize: "16px",
              color: "#fff",
              fontWeight: "bold",
              maxWidth: "300px",
              backgroundColor:
                notification.type === NOTIFICATION_TYPES.SUCCESS
                  ? "#4caf50"
                  : notification.type === NOTIFICATION_TYPES.ERROR
                  ? "#f44336"
                  : "#2196f3",
            }}
          >
            {notification.message}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default App;






