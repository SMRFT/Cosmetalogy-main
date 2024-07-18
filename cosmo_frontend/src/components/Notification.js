import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdClose } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import SignOut from './SignOut';

const Notification = () => {
const [lowQuantityMedicines, setLowQuantityMedicines] = useState([]);
const [nearExpiryMedicines, setNearExpiryMedicines] = useState([]);
const [panelVisible, setPanelVisible] = useState(false);

useEffect(() => {
  axios.get('http://127.0.0.1:8000/check_medicine_status/')
    .then(response => {
      setLowQuantityMedicines(response.data.low_quantity_medicines);
      setNearExpiryMedicines(response.data.near_expiry_medicines);
    })
    .catch(error => {
      console.error('There was an error fetching the medicine status:', error);
    });
}, []);

const togglePanel = () => {
    setPanelVisible(!panelVisible);
  };

  const hasNotifications = lowQuantityMedicines.length > 0 || nearExpiryMedicines.length > 0;

  return (
    <div>
      <NotificationIcon onClick={togglePanel}>
        <FaRegBell />
          {hasNotifications && <RedDot />}
      </NotificationIcon>
      <NotificationPanel visible={panelVisible}>
        <CloseIcon onClick={togglePanel}><IoMdClose /></CloseIcon>
        <h4 className="mb-3">Notifications</h4>

        {lowQuantityMedicines.length > 0 && (
          <Alert style={{ backgroundColor: "#F1F1F1", border: "#C7B7A3" }} className="mb-3">
            <center><Alert.Heading style={{ color: "#B3A398", fontSize: "1.2rem", fontFamily: "cursive" }}>Low Stock Medicines</Alert.Heading></center>
            <ul style={{ fontSize: "0.9rem", fontFamily: "initial", color: "#C7B7A3" }}>
              {lowQuantityMedicines.map((medicine, index) => (
                <li key={index}>
                  {medicine.medicine_name} - Stock: {medicine.old_stock} - Expiry Date: {medicine.expiry_date}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {nearExpiryMedicines.length > 0 && (
          <Alert style={{ backgroundColor: "#F1F1F1", border: "#C7B7A3" }}>
            <center><Alert.Heading style={{ color: "#B3A398", fontSize: "1.2rem", fontFamily: "cursive" }}>Near Expiry Medicines</Alert.Heading></center>
            <ul style={{ fontSize: "0.9rem", fontFamily: "initial", color: "#C7B7A3" }}>
              {nearExpiryMedicines.map((medicine, index) => (
                <li key={index}>
                  {medicine.medicine_name} - Stock: {medicine.old_stock} - Expiry Date: {medicine.expiry_date}
                </li>
              ))}
            </ul>
          </Alert>
        )}
      </NotificationPanel>
      <br />
    </div>
  );
};

const NotificationIcon = styled.div`
  position: fixed;
  right: 60px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 1100;

  svg {
    font-size: 2rem;
    color: grey;
  }

  &:hover {
    svg {
      color: black;
    }
  }
`;

const RedDot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 50%;
  border: 2px solid white;
`;

const NotificationPanel = styled.div`
  position: fixed;
  right: 0;
  top: 100px; /* Align with the top of the page */
  width: 400px;
  height: 80%;
  background-color: white;
  box-shadow: -1px 0px 7px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  transform: translateX(${props => (props.visible ? '0' : '100%')});
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  border-radius: 10px;
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  svg {
    font-size: 1.5rem;
    color: black;
  }

  &:hover {
    svg {
      color: gray;
    }
  }
`;

export default Notification;