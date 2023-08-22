import React from "react";
import "./NavBar.scss";
import pepe from "../../assets/img/pepe.png";

const NavBar = ({
  isConnected,
  connectWallet,
  defaultAccount,
  disconnectWallet,
  switchNetwork,
  isBscNetwork
}) => {
  const truncateWalletAddress = (address) => {
    if (address) {
      const truncatedAddress = `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
      return truncatedAddress;
    }
    return null;
  };

  const handleConnectDisconnect = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const renderConnectedButtons = () => (
    <div className="connected-buttons">
      <button className="nav__btn" onClick={switchNetwork}>
        Switch Network
      </button>
      <button className="nav__btn" onClick={disconnectWallet}>
        Disconnect Wallet
      </button>
    </div>
  );

  return (
    <div className="nav">
      <div className="container">
        {isConnected ? (
          <div className="connected-section">
            <p className="wallet-address">{truncateWalletAddress(defaultAccount)}</p>
            {renderConnectedButtons()}
            <button className="nav__btn connected-address">
              Connected: {truncateWalletAddress(defaultAccount)}
            </button>
          </div>
        ) : (
          <button className="nav__btn" onClick={handleConnectDisconnect}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
