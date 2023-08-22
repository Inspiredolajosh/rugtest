export const connectWallet = (isConnected, setIsConnected, accountChanged) => {
  if (isConnected) {
    disconnectWallet();
  } else {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChanged(result[0]);
          setIsConnected(true); // Set isConnected to true
        })
        .catch((error) => {
          console.error(error);
          window.alert("Failed to connect to the wallet.");
        });
    } else {
      window.alert("Please install MetaMask or another Ethereum wallet provider to connect.");
    }
  }
};


export const disconnectWallet = (setDefaultAccount, setIsConnected, setErrorMessage) => {
  setDefaultAccount(null);
  setIsConnected(false);
  setErrorMessage(null);
  localStorage.removeItem("connectedAccount");
};

export const accountChanged = (accountName, setDefaultAccount, setIsConnected) => {
  setDefaultAccount(accountName);
  setIsConnected(true);
};

// Other utility functions...
