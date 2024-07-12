import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdClose } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import BookedAppointments from './BookedAppointments';
import PatientDetails from './PatientDetails';
import Report from './Report';
import Logo from './images/salem-cosmetic-logo.png';
import SignOut from './SignOut';

const Doctor = ({ appointments }) => {
  const [lowQuantityMedicines, setLowQuantityMedicines] = useState([]);
  const [nearExpiryMedicines, setNearExpiryMedicines] = useState([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Redirect to BookedAppointments by default
    navigate('BookedAppointments');
  }, [navigate]);

  const togglePanel = () => {
    setPanelVisible(!panelVisible);
  };

  const hasNotifications = lowQuantityMedicines.length > 0 || nearExpiryMedicines.length > 0;

  return (
    <div>
      <Header>
        <HeaderLeft>
          <LogoContainer>
            <img src={Logo} alt="Logo" />
          </LogoContainer>
          <Navigation>
            <NavItem>
              <StyledLink to="BookedAppointments">Appointments</StyledLink>
            </NavItem>
            <NavItem>
              <StyledLink to="PatientDetails">Patient Details</StyledLink>
            </NavItem>
            <NavItem>
              <StyledLink to="Report">Report</StyledLink>
            </NavItem>
          </Navigation>
        </HeaderLeft>
        <NotificationIcon onClick={togglePanel}>
          <FaRegBell />
          {hasNotifications && <RedDot />}
        </NotificationIcon>
        <SignOut />
      </Header>
      <DoctorContainer>
        <Content>
          <Routes>
            <Route path="BookedAppointments" element={<BookedAppointments />} />
            <Route path="PatientDetails" element={<PatientDetails />} />
            <Route path="Report" element={<Report />} />
          </Routes>
        </Content>
      </DoctorContainer>
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

Doctor.propTypes = {
  appointments: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: white; // Ensure header has a background color to separate it from content
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Add shadow for better separation
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  img {
    max-width: 95%; /* Adjust as necessary */
    height: auto;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
  margin-left: 60px; /* Add some space between the logo and navigation */
`;

const NavItem = styled.div`
  font-size: 1.5rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: rgb(111, 136, 132);
  font-size: 1.2rem;
  margin: 0 15px;
  display: inline-block;
  transition: color 0.3s, font-size 0.3s;
  font-family: initial;

  &:hover {
    color: #CCB268;
    font-size: 1.4rem;
  }
`;

const DoctorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 70px); // Adjust height to account for header
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
`;

const NotificationIcon = styled.div`
  position: fixed;
  right: 70px;
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
  width: 400px;
  height: 90%;
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

export default Doctor;
