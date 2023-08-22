import React, { useState } from "react";

const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};

const Form = ({ eligibleAddresses  }) => {
  const [inputAddress, setInputAddress] = useState("");
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type) => {
    const newNotification = { message, type };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

    // Automatically remove the notification after 10 seconds
    setTimeout(() => {
      removeNotification(newNotification);
    }, 10000);
  };

  const removeNotification = (notificationToRemove) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification !== notificationToRemove)
    );
  };

  const checkEligibility = (e) => {
    e.preventDefault();

    if (inputAddress.trim() === "") {
      addNotification("Please enter a valid address.", NOTIFICATION_TYPES.ERROR);
      return;
    }

    const normalizedInputAddress = inputAddress.trim().toLowerCase();

    if (eligibleAddresses.some((address) => address.trim().toLowerCase() === normalizedInputAddress)) {
      addNotification("Congratulations, Eligible for Airdrop!", NOTIFICATION_TYPES.SUCCESS);
    } else {
      addNotification("Sorry, Not Eligible for Airdrop!", NOTIFICATION_TYPES.ERROR);
    }
  };

  return (
    <form className="form">
      <div className="container">
        <div className="form__group">
          <input
            type="text"
            className="form__input"
            placeholder="Paste wallet Address"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "14px",
              width: "70%",
              boxSizing: "border-box",
            }}
          />
        </div>

        <br />

        <div className="form__group">
          <button
            className="btn"
            onClick={checkEligibility}
            style={{
              padding: "8px 15px",
              width: "40%",
              borderRadius: "5px",
              fontSize: "14px",
              background: "#d36a24",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Check Eligibility
          </button>
        </div>
      </div>

      <div style={{ position: "fixed", top: "20px", right: "20px", display: "flex", flexDirection: "column", alignItems: "flex-end", zIndex: "999" }}>
        {notifications.map((notification, index) => (
          <div key={index} style={{ padding: "10px 15px", margin: "5px 0", borderRadius: "5px", fontSize: "16px", color: "#fff", fontWeight: "bold", maxWidth: "300px", backgroundColor: notification.type === NOTIFICATION_TYPES.SUCCESS ? "#4caf50" : "#f44336" }}>
            {notification.message}
          </div>
        ))}
      </div>
    </form>
  );
};

export default Form;
